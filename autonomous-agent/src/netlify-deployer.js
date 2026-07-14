/**
 * Netlify Deployer
 * Deploys websites to Netlify using the REST API
 */

import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import crypto from 'crypto';

export class NetlifyDeployer {
  constructor() {
    this.accessToken = process.env.NETLIFY_ACCESS_TOKEN;
    this.apiBase = 'https://api.netlify.com/api/v1';
  }

  /**
   * Deploy a website to Netlify
   * @param {Object} options - Deployment options
   * @param {string} options.siteName - Name for the Netlify site
   * @param {string} options.htmlPath - Path to the HTML file
   * @param {string} options.company - Company name
   * @returns {Promise<Object>} Deployment result with URL
   */
  async deploy({ siteName, htmlPath, company }) {
    console.log(`\n🚀 Deploying to Netlify: ${company}`);
    console.log(`   Site name: ${siteName}`);

    try {
      // Check if token is configured
      if (!this.accessToken || this.accessToken === 'your_netlify_token_here') {
        console.log('   ⚠️  No Netlify token configured');
        console.log('   📝 Creating local preview instead...');
        return await this.createLocalPreview({ siteName, htmlPath, company });
      }

      // Read the HTML file
      const html = await fs.readFile(htmlPath, 'utf-8');

      // Create a new site
      const site = await this.createSite(siteName);
      console.log(`   ✅ Site created: ${site.name}`);

      // Deploy the HTML file
      const deployment = await this.deployFiles(site.id, {
        'index.html': html
      });

      console.log(`   ✅ Deployed successfully!`);
      console.log(`   🌐 Live URL: ${deployment.url}`);

      return {
        success: true,
        siteId: site.id,
        url: deployment.url,
        deployUrl: deployment.deploy_url,
        adminUrl: `https://app.netlify.com/sites/${site.name}`,
      };

    } catch (error) {
      console.error(`   ❌ Deployment failed: ${error.message}`);

      // Fallback to local preview
      console.log('   📝 Creating local preview instead...');
      return await this.createLocalPreview({ siteName, htmlPath, company });
    }
  }

  /**
   * Create a new Netlify site
   */
  async createSite(siteName) {
    const response = await fetch(`${this.apiBase}/sites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: siteName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create site: ${error.message || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Deploy files to a Netlify site
   */
  async deployFiles(siteId, files) {
    // Prepare files for deployment
    const filesList = Object.entries(files).map(([path, content]) => ({
      path,
      sha: this.sha1(content),
    }));

    // Create deployment
    const deployResponse = await fetch(`${this.apiBase}/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: filesList.reduce((acc, file) => {
          acc[file.path] = file.sha;
          return acc;
        }, {}),
      }),
    });

    if (!deployResponse.ok) {
      throw new Error(`Failed to create deployment: ${deployResponse.statusText}`);
    }

    const deployment = await deployResponse.json();

    // Upload each file
    for (const [filePath, content] of Object.entries(files)) {
      await this.uploadFile(deployment.id, filePath, content);
    }

    // Wait for deployment to be ready
    return await this.waitForDeployment(deployment.id);
  }

  /**
   * Upload a file to a deployment
   */
  async uploadFile(deployId, filePath, content) {
    const sha = this.sha1(content);

    const response = await fetch(`${this.apiBase}/deploys/${deployId}/files/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/octet-stream',
      },
      body: content,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file ${filePath}: ${response.statusText}`);
    }
  }

  /**
   * Wait for deployment to be ready
   */
  async waitForDeployment(deployId, maxWait = 60000) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const response = await fetch(`${this.apiBase}/deploys/${deployId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      const deployment = await response.json();

      if (deployment.state === 'ready') {
        return deployment;
      }

      if (deployment.state === 'error') {
        throw new Error('Deployment failed');
      }

      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Deployment timeout');
  }

  /**
   * Calculate SHA1 hash (simple implementation for small files)
   */
  sha1(content) {
    return crypto.createHash('sha1').update(content).digest('hex');
  }

  /**
   * Create local preview when Netlify is not configured
   */
  async createLocalPreview({ siteName, htmlPath, company }) {
    const previewDir = path.join(process.cwd(), 'data', 'previews', siteName);
    await fs.mkdir(previewDir, { recursive: true });

    const html = await fs.readFile(htmlPath, 'utf-8');
    const previewPath = path.join(previewDir, 'index.html');
    await fs.writeFile(previewPath, html);

    const localUrl = `file://${previewPath}`;

    console.log(`   ✅ Local preview created`);
    console.log(`   📂 Location: ${previewPath}`);
    console.log(`   🌐 URL: ${localUrl}`);

    return {
      success: true,
      local: true,
      url: localUrl,
      previewPath,
      message: 'Local preview created. Configure NETLIFY_ACCESS_TOKEN to deploy to Netlify.',
    };
  }

  /**
   * Generate a URL-safe site name from company name
   */
  static generateSiteName(company) {
    return company
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }
}
