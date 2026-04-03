import { GymsService } from './gyms.service';
export declare class GymsController {
    private readonly gymsService;
    constructor(gymsService: GymsService);
    getGymBySubdomain(subdomain: string): Promise<{
        id: string;
        name: string;
        subdomain: string;
        description: string | null;
        facilities: string | null;
        instagram: string | null;
        timing: string | null;
        address: string | null;
    }>;
    getMyGymInfo(req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        subdomain: string;
        description: string | null;
        facilities: string | null;
        instagram: string | null;
        timing: string | null;
        address: string | null;
        updatedAt: Date;
    } | null>;
    updateMyGym(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        subdomain: string;
        description: string | null;
        facilities: string | null;
        instagram: string | null;
        timing: string | null;
        address: string | null;
        updatedAt: Date;
    }>;
    getMyAnnouncements(req: any): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        content: string;
    }[]>;
    createAnnouncement(req: any, content: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        content: string;
    }>;
    deleteAnnouncement(req: any, id: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        content: string;
    }>;
    getPlansBySubdomain(subdomain: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }[]>;
    getMyPlans(req: any): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }[]>;
    createPlan(req: any, data: any): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }>;
    deletePlan(req: any, id: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }>;
}
