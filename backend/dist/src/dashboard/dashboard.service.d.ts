import { PrismaService } from '../prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminStats(gymId: string): Promise<{
        totalMembers: number;
        activeMembers: number;
        expiredMembers: number;
        expiringSoon: number;
    }>;
    getMemberStats(userId: string): Promise<{
        message: string;
        status: string;
        gym: any;
        daysRemaining?: undefined;
        expiryDate?: undefined;
        startDate?: undefined;
        plan?: undefined;
        phone?: undefined;
    } | {
        status: string;
        daysRemaining: number;
        expiryDate: any;
        startDate: any;
        plan: any;
        gym: any;
        phone: any;
        message?: undefined;
    }>;
}
