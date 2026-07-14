#!/usr/bin/env node

import dotenv from 'dotenv';
import { CronJob } from 'cron';
import { WebsiteGenerator } from './website-generator.js';
import { EmailService } from './email-service.js';
import { ApprovalQueue } from './approval-queue.js';
import { LeadsManager } from './leads-manager.js';
import { StateManager } from './state-manager.js';
import { syncToCRM } from './sync-to-crm.js';

dotenv.config();

class AutonomousAgent {
  constructor() {
    this.websiteGenerator = new WebsiteGenerator();
    this.emailService = new EmailService();
    this.approvalQueue = new ApprovalQueue();
    this.leadsManager = new LeadsManager();
    this.stateManager = new StateManager();

    this.dailyLimit = parseInt(process.env.DAILY_WEBSITE_LIMIT || '50');
    this.isRunning = false;
  }

  async initialize() {
    console.log('🤖 Initializing SAOS Autonomous Agent...');

    await this.stateManager.initialize();
    await this.approvalQueue.initialize();
    await this.leadsManager.loadLeads();

    console.log('✅ Agent initialized successfully');
    console.log(`📊 Daily website limit: ${this.dailyLimit}`);
    console.log(`📧 Sender: ${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`);
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
          console.log(`\n🔨 Generating website for: ${lead.Company}`);

          // Generate website using ui-ux-pro-max skill
          const websiteData = await this.websiteGenerator.generate(lead);

          // Deploy to Netlify
          const deployUrl = await this.websiteGenerator.deployToNetlify(websiteData, lead);

          // Add to approval queue
          await this.approvalQueue.addToQueue({
            leadId: lead.id,
            company: lead.Company,
            email: lead.Email,
            phone: lead['Τηλέφωνο'],
            websiteUrl: lead['Ιστοσελίδα Εταιρίας'],
            demoUrl: deployUrl,
            websiteData: websiteData,
            status: 'pending_approval',
            createdAt: new Date().toISOString()
          });

          await this.stateManager.incrementWebsiteCount();
          console.log(`✅ Website generated and added to approval queue`);
          console.log(`🔗 Demo URL: ${deployUrl}`);

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
          console.log(`\n📧 Sending email to: ${item.company}`);

          const emailData = {
            to: item.email,
            subject: `Σας έφτιαξα ένα νέο site — δωρεάν preview`,
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
agent.start().catch(console.error);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down agent...');
  process.exit(0);
});
