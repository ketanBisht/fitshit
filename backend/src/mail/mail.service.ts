import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);
  private initialized = false;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    if (!process.env.SMTP_USER) {
      this.logger.warn('No SMTP_USER found in .env. Falling back to temporary Ethereal account for testing.');
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.initialized = true;
        this.logger.log(`Ethereal test account initialized: ${testAccount.user}`);
      } catch (error) {
        this.logger.error('Failed to create test ethereal account', error);
      }
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.initialized = true;
      this.logger.log(`SMTP transporter initialized with user: ${process.env.SMTP_USER}`);
    }
  }

  private async getTransporter() {
    // Wait for async initialization if it's ethereal
    let retries = 0;
    while (!this.initialized && retries < 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retries++;
    }
    return this.transporter;
  }

  async sendWelcomeEmail(to: string, name: string | null, role: string, plainTextPassword?: string, gymName?: string | null) {
    const transporter = await this.getTransporter();
    if (!transporter) return;

    let subject = 'Welcome to the Platform!';
    if (gymName) subject = `Welcome to ${gymName}!`;

    const html = `
      <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 16px; background-color: #ffffff; color: #1a1a1a; border: 1px solid #f0f0f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #000; margin: 0;">${subject}</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Hello <strong>${name || 'there'}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">We're excited to have you on board! Your account has been successfully created as a <strong>${role}</strong>.</p>
    
        ${plainTextPassword ? `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; margin: 32px 0;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Your Credentials</h3>
          <p style="margin: 8px 0; font-size: 15px; color: #1e293b;">Email: <strong>${to}</strong></p>
          <p style="margin: 8px 0; font-size: 15px; color: #1e293b;">Temporary Password: <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${plainTextPassword}</code></p>
        </div>
        <p style="font-size: 14px; line-height: 1.5; color: #ef4444; font-weight: 500;">Please log in and update your password immediately for security.</p>
        ` : ''}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
          <p style="font-size: 13px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} ${gymName || 'FitShit'}. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      const info = await transporter.sendMail({
        from: `"${gymName || 'Admin'}" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@fitshit.com'}>`,
        to: to,
        subject: subject,
        html: html,
      });

      this.logger.log(`Email sent to: ${to}`);
      if (!process.env.SMTP_USER) {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(`Error sending welcome email to ${to}:`, error);
    }
  }

  async sendPaymentReceiptEmail(to: string, name: string | null, amount: number, planName: string, gymName: string | null) {
    const transporter = await this.getTransporter();
    if (!transporter) return;

    const subject = `Payment Confirmed - ${gymName}`;
    const html = `
      <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 16px; background-color: #ffffff; color: #1a1a1a; border: 1px solid #f0f0f0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: #ecfdf5; width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="color: #10b981; font-size: 32px;">&check;</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #000; margin: 0;">Payment Successful</h1>
        </div>

        <p style="font-size: 16px; color: #4b5563;">Hi ${name},</p>
        <p style="font-size: 16px; color: #4b5563;">Thank you for your payment. Your membership for <strong>${planName}</strong> is now active.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; margin: 32px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748b;">Amount Paid:</span>
            <span style="font-weight: 700; color: #1e293b;">$${amount.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Plan:</span>
            <span style="font-weight: 600; color: #1e293b;">${planName}</span>
          </div>
        </div>

        <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 40px;">
          Thanks for being a part of ${gymName}!
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"${gymName}" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@fitshit.com'}>`,
        to: to,
        subject: subject,
        html: html,
      });
      this.logger.log(`Payment receipt sent to: ${to}`);
    } catch (error) {
      this.logger.error(`Error sending payment receipt to ${to}:`, error);
    }
  }

  async sendAnnouncementEmails(gymName: string | null, content: string, emails: string[]) {
    if (!emails || emails.length === 0) return;

    const transporter = await this.getTransporter();
    if (!transporter) return;

    const subject = `Update from ${gymName}`;
    const html = `
      <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 16px; background-color: #ffffff; color: #1a1a1a; border: 1px solid #f0f0f0;">
        <div style="border-left: 4px solid #3b82f6; padding-left: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #000; margin: 0;">Announcement</h1>
          <p style="font-size: 14px; color: #64748b; margin-top: 4px;">from ${gymName}</p>
        </div>

        <div style="font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-wrap;">${content}</div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
          <p style="font-size: 12px; color: #94a3b8;">
            You are receiving this as an active member of ${gymName}. 
            If you wish to opt out, please contact your gym administrator.
          </p>
        </div>
      </div>
    `;

    try {
      const info = await transporter.sendMail({
        from: `"${gymName} Announcements" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@fitshit.com'}>`,
        bcc: emails, // BCC ensures privacy 
        subject: subject,
        html: html,
      });

      this.logger.log(`Announcement dispatched to ${emails.length} active members of ${gymName}`);
      if (!process.env.SMTP_USER) {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send announcement emails for ${gymName}:`, error);
    }
  }
}
