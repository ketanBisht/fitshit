import { PrismaService } from '../prisma.service';
export declare class GymsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    getGymInfo(gymId: string): Promise<{
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
    updateGym(gymId: string, data: {
        description: string;
        facilities: string;
        name: string;
        instagram?: string;
        timing?: string;
        address?: string;
    }): Promise<{
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
    getAnnouncements(gymId: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        content: string;
    }[]>;
    createAnnouncement(gymId: string, content: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        content: string;
    }>;
    deleteAnnouncement(gymId: string, announcementId: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        content: string;
    }>;
    getPlans(gymId: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }[]>;
    getPlansBySubdomain(subdomain: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }[]>;
    createPlan(gymId: string, data: {
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }>;
    deletePlan(gymId: string, planId: string): Promise<{
        id: string;
        gymId: string;
        createdAt: Date;
        name: string;
        price: number;
        durationMonths: number;
        features: string;
    }>;
}
