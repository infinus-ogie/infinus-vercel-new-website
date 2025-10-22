/**
 * Email Test Script
 * 
 * Testira email konfiguraciju i šalje test email
 * 
 * Usage: npx tsx scripts/test-email.ts
 */

import nodemailer from 'nodemailer'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

console.log('🧪 Email Configuration Test\n')

// Email configuration
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'ognjen.drinic31@gmail.com',
    pass: (process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD)?.replace(/\s/g, '')
  }
}

console.log('📋 Configuration:')
console.log(`   Host: ${EMAIL_CONFIG.host}`)
console.log(`   Port: ${EMAIL_CONFIG.port}`)
console.log(`   User: ${EMAIL_CONFIG.auth.user}`)
console.log(`   Password: ${EMAIL_CONFIG.auth.pass ? '✓ Found (' + EMAIL_CONFIG.auth.pass.length + ' chars)' : '✗ MISSING'}`)
console.log()

if (!EMAIL_CONFIG.auth.pass) {
  console.error('❌ ERROR: No email password found!')
  console.error('   Please set GMAIL_APP_PASSWORD in .env.local')
  console.error('\n📝 How to get Gmail App Password:')
  console.error('   1. Go to: https://myaccount.google.com/apppasswords')
  console.error('   2. Create new App Password for "Infinus Website"')
  console.error('   3. Add to .env.local: GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx')
  process.exit(1)
}

async function testEmailConnection() {
  try {
    console.log('🔌 Testing SMTP connection...')
    const transporter = nodemailer.createTransport(EMAIL_CONFIG)
    
    // Verify connection
    await transporter.verify()
    console.log('✅ SMTP connection successful!\n')
    
    // Send test email
    console.log('📧 Sending test email...')
    const result = await transporter.sendMail({
      from: `"Infinus Website Test" <${EMAIL_CONFIG.auth.user}>`,
      to: EMAIL_CONFIG.auth.user,
      replyTo: EMAIL_CONFIG.auth.user,
      subject: '✅ Infinus Website Email Test - Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Email Test Successful! 🎉</h1>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0;">
            <h2 style="color: #065f46; margin-top: 0;">Configuration Details</h2>
            <p><strong>SMTP Host:</strong> ${EMAIL_CONFIG.host}</p>
            <p><strong>SMTP Port:</strong> ${EMAIL_CONFIG.port}</p>
            <p><strong>From Email:</strong> ${EMAIL_CONFIG.auth.user}</p>
            <p><strong>To Email:</strong> ${EMAIL_CONFIG.auth.user}</p>
            <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 16px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #1e40af; margin-top: 0;">✅ Next Steps</h3>
            <ol style="color: #475569;">
              <li>Email configuration is working correctly</li>
              <li>Test Join Us form on homepage</li>
              <li>Test Contact form on /contact page</li>
              <li>Add office@infinus.rs to recipients when ready</li>
            </ol>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>This is an automated test email from the Infinus website.</p>
            <p>If you received this, your email configuration is working correctly!</p>
          </div>
        </div>
      `,
      text: `
Email Test Successful!

Configuration Details:
- SMTP Host: ${EMAIL_CONFIG.host}
- SMTP Port: ${EMAIL_CONFIG.port}
- From Email: ${EMAIL_CONFIG.auth.user}
- To Email: ${EMAIL_CONFIG.auth.user}
- Test Time: ${new Date().toISOString()}

Next Steps:
1. Email configuration is working correctly
2. Test Join Us form on homepage
3. Test Contact form on /contact page
4. Add office@infinus.rs to recipients when ready

This is an automated test email from the Infinus website.
If you received this, your email configuration is working correctly!
      `
    })
    
    console.log('✅ Test email sent successfully!')
    console.log(`   Message ID: ${result.messageId}`)
    console.log(`\n📬 Check inbox: ${EMAIL_CONFIG.auth.user}`)
    console.log('\n🎉 Email configuration is working correctly!')
    
  } catch (error) {
    console.error('\n❌ Email test failed!')
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error')
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        console.error('\n💡 Troubleshooting:')
        console.error('   - Make sure you created a Gmail App Password')
        console.error('   - Go to: https://myaccount.google.com/apppasswords')
        console.error('   - Use the 16-character app password, not your Gmail password')
        console.error('   - Add to .env.local: GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx')
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('\n💡 Troubleshooting:')
        console.error('   - Check your internet connection')
        console.error('   - Make sure port 587 is not blocked by firewall')
      }
    }
    
    process.exit(1)
  }
}

// Run the test
testEmailConnection()

