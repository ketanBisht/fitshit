import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
export declare class GymsService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    getGymBySubdomain(subdomain: string): Promise<{
        name: string;
        id: string;
        subdomain: string;
        description: string | null;
        facilities: string | null;
        instagram: string | null;
        timing: string | null;
        address: string | null;
    }>;
    getGymInfo(gymId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
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
        name: string;
        id: string;
        createdAt: Date;
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
        name: string;
        id: string;
        gymId: string;
        createdAt: Date;
        price: number;
        durationMonths: number;
        features: string;
    }[]>;
    getPlansBySubdomain(subdomain: string): Promise<{
        name: string;
        id: string;
        gymId: string;
        createdAt: Date;
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
        name: string;
        id: string;
        gymId: string;
        createdAt: Date;
        price: number;
        durationMonths: number;
        features: string;
    }>;
    deletePlan(gymId: string, planId: string): Promise<{
        name: string;
        id: string;
        gymId: string;
        createdAt: Date;
        price: number;
        durationMonths: number;
        features: string;
    }>;
}
