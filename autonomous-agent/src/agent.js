#!/usr/bin/env node

import dotenv from 'dotenv';
import { CronJob } from 'cron';
import { WebsiteGenerator } from './website-generator.js';
import { DesignerAgent } from './designer-agent.js';
import { EmailService } from './email-service.js';
import { ApprovalQueue } from './approval-queue.js';
import { LeadsManager } from './leads-manager.js';
import { StateManager } from './state-manager.js';
import { syncToCRM } from './sync-to-crm.js';
import { QAGate } from './qa-gate.js';
import { SitePublisher } from './site-publisher.js';
import { SharedLedger } from './shared-ledger.js';
import { NetlifyDeployer } from './netlify-deployer.js';

dotenv.config();

class AutonomousAgent {
  constructor() {
    this.websiteGenerator = new WebsiteGenerator();
    this.designerAgentEnabled = process.env.DESIGNER_AGENT_ENABLED === 'true';
    this.designerAgent = new DesignerAgent();
    this.emailService = new EmailService();
    this.approvalQueue = new ApprovalQueue();
    this.leadsManager = new LeadsManager();
    this.stateManager = new StateManager();
    this.qaGate = new QAGate();
    this.sitePublisher = new SitePublisher();
    this.sharedLedger = new SharedLedger();
    this.netlifyDeployer = new NetlifyDeployer();

    this.dailyLimit = parseInt(process.env.DAILY_WEBSITE_LIMIT || '50');
    this.qaMaxRetries = parseInt(process.env.QA_MAX_RETRIES || '2');
    this.isRunning = false;
  }

  async initialize() {
    console.log('🤖 Initializing SAOS Autonomous Agent...');

    await this.stateManager.initialize();
    await this.approvalQueue.initialize();
    await this.leadsManager.loadLeads();

    if (this.qaGate.enabled) {
      await this.qaGate.initialize();
    }
    console.log(`🧪 QA gate: ${this.qaGate.enabled ? 'enabled' : 'disabled'}`);

    if (this.designerAgentEnabled) {
      await this.designerAgent.initialize();
    }
    console.log(`🎨 Generator: ${this.designerAgentEnabled ? 'designer-agent' : 'website-generator'}`);

    const coordinationEnabled = this.sitePublisher.isConfigured();
    console.log(`🔗 Team coordination: ${coordinationEnabled ? `enabled (${process.env.SITES_REPO})` : 'disabled'}`);

    console.log('✅ Agent initialized successfully');
    console.log(`📊 Daily website limit: ${this.dailyLimit}`);
    console.log(`📧 Sender: ${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`);
  }

  /**
   * Generate website data via the active generator (DesignerAgent or WebsiteGenerator),
   * always returning the shape deployToNetlify() expects:
   * { html, company, industry, description, generatedAt }.
   * @param {Object} lead
   * @param {Array|null} [qaFeedback] - QA issues from a previous failed attempt, if any
   * @returns {Promise<Object>} websiteData
   */
  async generateWebsite(lead, qaFeedback = null) {
    if (this.designerAgentEnabled) {
      return this.generateWebsiteViaDesignerAgent(lead, qaFeedback);
    }
    return this.websiteGenerator.generate(lead, qaFeedback ? { qaFeedback } : {});
  }

  /**
   * Adapts DesignerAgent.designWebsite()'s result shape
   * ({ job_id, status, completed_at, output: { html, ... } }) into the
   * websiteData shape deployToNetlify() expects.
   * @private
   */
  async generateWebsiteViaDesignerAgent(lead, qaFeedback) {
    const result = await this.designerAgent.designWebsite(lead, qaFeedback ? { qaFeedback } : {});
    const html = result && result.output && result.output.html;

    if (!html) {
      throw new Error('DesignerAgent returned no HTML output');
    }

    return {
      html,
      company: lead.Company,
      industry: this.websiteGenerator.detectIndustry(lead['NACE 2 Desc']),
      description: lead['Περιγραφή 1'] || '',
      generatedAt: result.completed_at || new Date().toISOString(),
    };
  }

  /**
   * Publish a generated site to the shared GitHub repo so teammates' agents
   * can see it exists. Never throws — a publish failure must not fail the
   * lead since the site is already saved locally and queued for approval.
   * @param {Object} params
   * @param {string} params.slug
   * @param {Object} params.websiteData
   * @param {Object} params.lead
   * @param {number|null} [params.qaScore]
   * @param {string|null} [params.qaStatus]
   */
  async publishSiteToTeam({ slug, websiteData, lead, qaScore = null, qaStatus = null }) {
    try {
      const result = await this.sitePublisher.publishSite({
        slug,
        html: websiteData.html,
        company: lead.Company,
        lead,
        qaScore,
        qaStatus
      });

      if (result.published) {
        console.log(`📤 Ανέβηκε στο repo: ${result.path}`);
      } else {
        console.debug(`📤 Δεν ανέβηκε στο repo: ${result.reason}`);
      }
    } catch (publishError) {
      console.warn(`⚠️  Αποτυχία δημοσίευσης στο repo για ${lead.Company}: ${publishError.message}`);
    }
  }

  /**
   * Derive the site slug from a stored demo URL like
   * "agent-drafts/<slug>/index.html", or null if it can't be determined.
   * @param {string|null|undefined} demoUrl
   * @returns {string|null}
   */
  extractSlugFromDemoUrl(demoUrl) {
    if (!demoUrl) return null;
    const match = String(demoUrl).match(/([^/\\]+)[/\\]index\.html$/i);
    return match ? match[1] : null;
  }

  /**
   * Deploy the generated site to Netlify so the demo link embedded in the
   * outreach email is a real, public https:// URL instead of a local CRM
   * path. Never throws and never loses the lead — falls back to the
   * already-saved local URL when Netlify isn't configured or the deploy
   * fails, and surfaces the reason via `notes` so it's visible on the queue item.
   * @param {Object} params
   * @param {string} params.slug
   * @param {Object} params.websiteData
   * @param {string} params.localUrl - fallback URL from websiteGenerator.deployToNetlify()
   * @param {Object} params.lead
   * @returns {Promise<{demoUrl: string, notes: string|null}>}
   */
  async deployToPublicUrl({ slug, websiteData, localUrl, lead }) {
    const result = await this.netlifyDeployer.deploySite({
      slug,
      html: websiteData.html,
      company: lead.Company
    });

    if (result.deployed) {
      console.log(`🌐 Netlify: ${result.url}`);
      return { demoUrl: result.url, notes: null };
    }

    console.warn(`⚠️  Netlify deploy απέτυχε για ${lead.Company} (${result.reason}) — χρήση τοπικού path στο email`);
    return {
      demoUrl: localUrl,
      notes: `⚠️ Δεν έγινε deploy στο Netlify (${result.reason}) — ο σύνδεσμος στο email ΔΕΝ είναι δημόσιος`
    };
  }

  async runDailyCycle() {
    if (this.isRunning) {
      console.log('⚠️  Daily cycle already running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('\n🚀 Starting daily cycle...');
    console.log(`📅 ${new Date().toLocaleString()}`);

    try {
      const todayCount = await this.stateManager.getTodayWebsiteCount();
      const remaining = this.dailyLimit - todayCount;

      if (remaining <= 0) {
        console.log('✅ Daily limit reached. Waiting for tomorrow...');
        this.isRunning = false;
        return;
      }

      console.log(`📈 Generated today: ${todayCount}/${this.dailyLimit}`);
      console.log(`🎯 Generating ${Math.min(remaining, 10)} websites in this batch...`);

      // Generate websites in batches of 10
      const batchSize = Math.min(remaining, 10);
      const leads = await this.leadsManager.getNextLeads(batchSize);

      for (const lead of leads) {
        try {
          const slug = this.websiteGenerator.generateSiteName(lead.Company);

          try {
            const alreadyExists = await this.sitePublisher.siteExists(slug);
            if (alreadyExists) {
              console.log(`⏭️  ${lead.Company}: το site υπάρχει ήδη στο repo — παραλείπεται`);
              continue;
            }
          } catch (existsError) {
            console.warn(`⚠️  ${lead.Company}: αδύνατος ο έλεγχος ύπαρξης site στο repo — παραλείπεται για ασφάλεια: ${existsError.message}`);
            continue;
          }

          console.log(`\n🔨 Generating website for: ${lead.Company}`);

          if (!this.qaGate.enabled) {
            // Generate website using the active generator (designer-agent or website-generator)
            const websiteData = await this.generateWebsite(lead);

            // Save locally (CRM-served path — used as the fallback demo URL)
            const localUrl = await this.websiteGenerator.deployToNetlify(websiteData, lead);

            // Deploy to Netlify for a public demo link
            const { demoUrl, notes } = await this.deployToPublicUrl({ slug, websiteData, localUrl, lead });

            // Add to approval queue
            await this.approvalQueue.addToQueue({
              leadId: lead.id,
              company: lead.Company,
              email: lead.Email,
              phone: lead['Τηλέφωνο'],
              websiteUrl: lead['Ιστοσελίδα Εταιρίας'],
              demoUrl: demoUrl,
              notes: notes,
              websiteData: websiteData,
              status: 'pending_approval',
              createdAt: new Date().toISOString()
            });

            await this.stateManager.incrementWebsiteCount();
            console.log(`✅ Website generated and added to approval queue`);
            console.log(`🔗 Demo URL: ${demoUrl}`);

            await this.publishSiteToTeam({ slug, websiteData, lead });
            continue;
          }

          // QA-gated flow
          let attempt = 0;
          let qaFeedback = null;
          let websiteData;
          let localUrl;
          let htmlPath;
          let verdict = null;

          // eslint-disable-next-line no-constant-condition
          while (true) {
            websiteData = await this.generateWebsite(lead, qaFeedback);
            localUrl = await this.websiteGenerator.deployToNetlify(websiteData, lead);
            htmlPath = this.websiteGenerator.lastSavedHtmlPath;

            if (!htmlPath) {
              console.warn(`⚠️  No saved HTML path for ${lead.Company} — skipping QA review`);
              verdict = null;
              break;
            }

            try {
              verdict = await this.qaGate.review({ htmlPath, company: lead.Company, lead });
            } catch (qaError) {
              console.error(`❌ QA gate review failed for ${lead.Company}:`, qaError.message);
              verdict = null;
              break;
            }

            if (verdict && !verdict.pass && attempt < this.qaMaxRetries) {
              attempt++;
              qaFeedback = verdict.issues;
              console.log(`🔁 QA failed (score ${verdict.score} < ${verdict.minScore}) — regenerating attempt ${attempt}`);
              continue;
            }

            break;
          }

          console.log(`🧪 QA total attempts: ${attempt + 1}`);

          const status = verdict === null
            ? 'pending_approval'
            : (verdict.pass ? 'pending_approval' : 'qa_failed');
          const qaStatus = verdict === null
            ? 'qa_error'
            : (verdict.pass ? 'qa_passed' : 'qa_failed');

          // Deploy to Netlify for a public demo link (once, after QA is resolved)
          const { demoUrl, notes } = await this.deployToPublicUrl({ slug, websiteData, localUrl, lead });

          // Add to approval queue
          await this.approvalQueue.addToQueue({
            leadId: lead.id,
            company: lead.Company,
            email: lead.Email,
            phone: lead['Τηλέφωνο'],
            websiteUrl: lead['Ιστοσελίδα Εταιρίας'],
            demoUrl: demoUrl,
            notes: notes,
            websiteData: websiteData,
            status: status,
            createdAt: new Date().toISOString(),
            qaScore: verdict?.score ?? null,
            qaStatus: qaStatus,
            qaReport: verdict ?? null
          });

          await this.stateManager.incrementWebsiteCount();
          console.log(`✅ Website generated and added to approval queue (status: ${status})`);
          console.log(`🔗 Demo URL: ${demoUrl}`);

          await this.publishSiteToTeam({ slug, websiteData, lead, qaScore: verdict?.score ?? null, qaStatus });

        } catch (error) {
          console.error(`❌ Error generating website for ${lead.Company}:`, error.message);
          await this.leadsManager.markLeadAsFailed(lead.id, error.message);
        }
      }

      console.log('\n✅ Daily cycle completed');

      // Sync drafts to CRM
      await syncToCRM().catch(err => console.error('Failed to sync to CRM:', err.message));

    } catch (error) {
      console.error('❌ Error in daily cycle:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async checkApprovedWebsites() {
    console.log('\n📬 Checking for approved websites to send...');

    try {
      const approved = await this.approvalQueue.getApproved();

      if (approved.length === 0) {
        console.log('📭 No approved websites to send');
        return;
      }

      console.log(`📨 Found ${approved.length} approved websites to send`);

      for (const item of approved) {
        try {
          let alreadySent;
          try {
            alreadySent = await this.sharedLedger.wasSent(item.email);
          } catch (checkError) {
            if (checkError.message && checkError.message.includes('SharedLedger.ledgerKey')) {
              // Malformed/empty email — this item can never be checked or sent, fail it explicitly.
              console.error(`❌ Μη έγκυρο email για ${item.company}: ${checkError.message}`);
              await this.approvalQueue.markAsFailed(item.id, checkError.message);
              continue;
            }
            console.warn(`⚠️ Αδύνατος ο έλεγχος αποστολής για ${item.company} — παραλείπεται για ασφάλεια:`, checkError.message);
            continue;
          }

          if (alreadySent) {
            console.log(`⏭️  ${item.company}: έχει ήδη σταλεί email από την ομάδα — παραλείπεται`);
            await this.approvalQueue.markAsSent(item.id);
            continue;
          }

          console.log(`\n📧 Sending email to: ${item.company}`);

          const subject = `Σας έφτιαξα ένα νέο site — δωρεάν preview`;
          const emailData = {
            to: item.email,
            subject,
            clientName: item.company,
            demoUrl: item.demoUrl,
            additionalNotes: item.notes || '',
            senderName: process.env.SENDER_NAME,
            senderEmail: process.env.SENDER_EMAIL,
            senderPhone: process.env.SENDER_PHONE
          };

          await this.emailService.sendEmail(emailData);
          await this.approvalQueue.markAsSent(item.id);

          console.log(`✅ Email sent successfully to ${item.company}`);

          try {
            await this.sharedLedger.recordSent({
              email: item.email,
              company: item.company,
              slug: this.extractSlugFromDemoUrl(item.demoUrl ?? item.demo_url),
              subject
            });
          } catch (recordError) {
            console.warn(`⚠️  Αποτυχία καταγραφής αποστολής στο shared ledger για ${item.company}:`, recordError.message);
          }

        } catch (error) {
          console.error(`❌ Error sending email to ${item.company}:`, error.message);
          await this.approvalQueue.markAsFailed(item.id, error.message);
        }
      }

      console.log('\n✅ Email sending completed');

    } catch (error) {
      console.error('❌ Error checking approved websites:', error);
    }
  }

  async monitorReplies() {
    console.log('\n📥 Monitoring email replies...');

    try {
      const replies = await this.emailService.checkReplies();

      if (replies.length > 0) {
        console.log(`📨 Found ${replies.length} new replies`);

        for (const reply of replies) {
          await this.approvalQueue.addReply(reply);
          console.log(`✅ Reply logged from: ${reply.from}`);
        }
      } else {
        console.log('📭 No new replies');
      }

    } catch (error) {
      console.error('❌ Error monitoring replies:', error);
    }
  }

  startScheduler() {
    console.log('\n⏰ Starting scheduler...');

    // Generate websites daily at 9:00 AM
    const generateJob = new CronJob('0 9 * * *', async () => {
      await this.runDailyCycle();
    });

    // Check for approved websites every hour
    const approvalJob = new CronJob('0 * * * *', async () => {
      await this.checkApprovedWebsites();
    });

    // Monitor replies every 30 minutes
    const replyJob = new CronJob('*/30 * * * *', async () => {
      await this.monitorReplies();
    });

    generateJob.start();
    approvalJob.start();
    replyJob.start();

    console.log('✅ Scheduler started');
    console.log('📅 Website generation: Daily at 9:00 AM');
    console.log('✉️  Approval check: Every hour');
    console.log('📥 Reply monitoring: Every 30 minutes');
  }

  async start() {
    await this.initialize();

    console.log('\n🎬 Agent is now running...');
    console.log('Press Ctrl+C to stop\n');

    // Start the scheduler
    this.startScheduler();

    // Run initial cycle immediately for testing
    console.log('🔄 Running initial cycle...');
    await this.runDailyCycle();
    await this.checkApprovedWebsites();
  }
}

// Start the agent
const agent = new AutonomousAgent();

if (process.argv.includes('--check-config')) {
  console.log(`qa_gate: ${agent.qaGate.enabled ? 'enabled' : 'disabled'}`);
  console.log(`generator: ${agent.designerAgentEnabled ? 'designer-agent' : 'website-generator'}`);
  console.log(`daily_limit: ${agent.dailyLimit}`);
  console.log(`team_coordination: ${agent.sitePublisher.isConfigured() ? 'enabled' : 'disabled'}`);
  console.log(`netlify: ${agent.netlifyDeployer.isConfigured() ? 'enabled' : 'disabled'}`);
  process.exit(0);
} else {
  agent.start().catch(console.error);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down agent...');
    process.exit(0);
  });
}
