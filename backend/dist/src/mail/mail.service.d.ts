export declare class MailService {
    private transporter;
    private readonly logger;
    private initialized;
    constructor();
    private initTransporter;
    private getTransporter;
    sendWelcomeEmail(to: string, name: string | null, role: string, plainTextPassword?: string, gymName?: string | null): Promise<void>;
    sendPaymentReceiptEmail(to: string, name: string | null, amount: number, planName: string, gymName: string | null): Promise<void>;
    sendAnnouncementEmails(gymName: string | null, content: string, emails: string[]): Promise<void>;
    sendPasswordResetEmail(to: string, name: string | null, token: string, gymName: string | null, subdomain: string): Promise<void>;
}
