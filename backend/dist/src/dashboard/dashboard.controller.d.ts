import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminStats(req: any): Promise<{
        totalMembers: number;
        activeMembers: number;
        expiredMembers: number;
        expiringSoon: number;
    }>;
    getMemberStats(req: any): Promise<{
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
