import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
}
