import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    registerAdmin(data: any): Promise<{
        message: string;
    }>;
    registerMember(data: any): Promise<{
        message: string;
    }>;
    login(data: any): Promise<{
        access_token: string;
        role: string;
    }>;
    forgotPassword(data: any): Promise<{
        message: string;
    }>;
    resetPassword(data: any): Promise<{
        message: string;
    }>;
}
