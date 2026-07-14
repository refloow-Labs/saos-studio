#!/usr/bin/env node

/**
 * Test script for the autonomous agent
 * Runs a single cycle without scheduling
 */

import dotenv from 'dotenv';
import { WebsiteGenerator } from './website-generator.js';
import { EmailService } from './email-service.js';
import { ApprovalQueue } from './approval-queue.js';
import { LeadsManager } from './leads-manager.js';
import { StateManager } from './state-manager.js';

dotenv.config();

async function testAgent() {
  console.log('🧪 Testing Autonomous Agent\n');

  const websiteGenerator = new WebsiteGenerator();
  const emailService = new EmailService();
  const approvalQueue = new ApprovalQueue();
  const leadsManager = new LeadsManager();
  const stateManager = new StateManager();

  try {
    // Initialize
    console.log('1️⃣  Initializing components...');
    await stateManager.initialize();
    await approvalQueue.initialize();
    await leadsManager.loadLeads();
    console.log('   ✅ Initialized\n');

    // Get stats
    const stats = leadsManager.getStats();
    console.log('📊 Lead Stats:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Processed: ${stats.processed}`);
    console.log(`   Remaining: ${stats.remaining}\n`);

    // Get test leads
    console.log('2️⃣  Getting test leads (2)...');
    const leads = await leadsManager.getNextLeads(2);
    console.log(`   ✅ Found ${leads.length} leads\n`);

    if (leads.length === 0) {
      console.log('❌ No suitable leads found. Make sure your CSV has companies with:');
      console.log('   - Valid email addresses');
      console.log('   - No existing website (or placeholder website)\n');
      return;
    }

    // Generate websites
    for (const lead of leads) {
      console.log(`3️⃣  Generating website for: ${lead.Company}`);

      try {
        const websiteData = await websiteGenerator.generate(lead);
        console.log('   ✅ Website generated');

        const deployUrl = await websiteGenerator.deployToNetlify(websiteData, lead);
        console.log(`   ✅ Deployed: ${deployUrl}`);

        await approvalQueue.addToQueue({
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

        await stateManager.incrementWebsiteCount();
        console.log('   ✅ Added to approval queue\n');

      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }

    // Show queue stats
    const queueStats = await approvalQueue.getStats();
    console.log('📊 Approval Queue Stats:');
    Object.entries(queueStats).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    console.log();

    // Test email sending (if there are approved items)
    const approved = await approvalQueue.getApproved();
    if (approved.length > 0) {
      console.log(`4️⃣  Found ${approved.length} approved websites`);
      console.log('   Would you like to send test emails? (This will actually send!)');
      console.log('   Press Ctrl+C to skip, or wait 5 seconds to continue...\n');

      await new Promise(resolve => setTimeout(resolve, 5000));

      for (const item of approved.slice(0, 1)) { // Only send 1 test email
        console.log(`   📧 Sending test email to: ${item.company}`);

        const emailData = {
          to: item.email,
          subject: `Σας έφτιαξα ένα νέο site — δωρεάν preview`,
          clientName: item.company,
          demoUrl: item.demo_url,
          additionalNotes: item.notes || '',
          senderName: process.env.SENDER_NAME,
          senderEmail: process.env.SENDER_EMAIL,
          senderPhone: process.env.SENDER_PHONE
        };

        try {
          await emailService.sendEmail(emailData);
          await approvalQueue.markAsSent(item.id);
          console.log('   ✅ Email sent successfully\n');
        } catch (error) {
          console.error(`   ❌ Email error: ${error.message}\n`);
        }
      }
    } else {
      console.log('4️⃣  No approved websites to send\n');
    }

    // Test reply monitoring
    console.log('5️⃣  Checking for email replies...');
    const replies = await emailService.checkReplies();
    console.log(`   ✅ Found ${replies.length} replies\n`);

    console.log('🎉 Test complete!\n');
    console.log('Next steps:');
    console.log('1. Open your CRM:');
    console.log('   open ../../../../crm/index.html');
    console.log('   (or just double-click: Desktop/SAOS Studio/crm/index.html)');
    console.log('2. Click "Agent Drafts" tab in the sidebar');
    console.log('3. Review and approve the generated websites');
    console.log('4. Refresh CRM after approving to update status\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
  }
}

testAgent().catch(console.error);
