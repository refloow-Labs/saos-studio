#!/usr/bin/env node

import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'];

async function setupGmailAuth() {
  console.log('🔐 Gmail API Setup\n');

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('❌ Missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET in .env file');
    console.log('\nPlease follow these steps:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a project or select an existing one');
    console.log('3. Enable the Gmail API');
    console.log('4. Create OAuth 2.0 credentials (Desktop app)');
    console.log('5. Add the credentials to your .env file\n');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('📋 Step 1: Authorize this app by visiting this URL:');
  console.log('\n' + authUrl + '\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('📝 Step 2: Enter the authorization code from the page: ', async (code) => {
    rl.close();

    try {
      const { tokens } = await oauth2Client.getToken(code);

      console.log('\n✅ Successfully obtained tokens!');
      console.log('\n📋 Add this to your .env file:');
      console.log(`\nGMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);

      // Update .env file
      try {
        let envContent = await fs.readFile('.env', 'utf-8');

        if (envContent.includes('GMAIL_REFRESH_TOKEN=')) {
          envContent = envContent.replace(
            /GMAIL_REFRESH_TOKEN=.*/,
            `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`
          );
        } else {
          envContent += `\nGMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`;
        }

        await fs.writeFile('.env', envContent);
        console.log('✅ .env file updated automatically!\n');

      } catch (err) {
        console.log('⚠️  Could not update .env automatically. Please add the token manually.\n');
      }

      // Test the token
      oauth2Client.setCredentials(tokens);
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const profile = await gmail.users.getProfile({ userId: 'me' });
      console.log(`✅ Successfully authenticated as: ${profile.data.emailAddress}\n`);
      console.log('🎉 Setup complete! You can now run the agent.\n');

    } catch (err) {
      console.error('❌ Error retrieving access token:', err.message);
      process.exit(1);
    }
  });
}

setupGmailAuth();
