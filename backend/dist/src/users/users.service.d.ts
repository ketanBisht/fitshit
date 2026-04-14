import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
export declare class UsersService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    createMember(data: any, adminGymId: string): Promise<{
        message: string;
        id: string;
    }>;
    createMembersBulk(members: any[], adminGymId: string): Promise<{
        message: string;
        total: number;
        skipped: number;
    }>;
    getMembers(gymId: string): Promise<({
        membership: ({
            plan: {
                name: string;
                id: string;
                gymId: string;
                createdAt: Date;
                price: number;
                durationMonths: number;
                features: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date;
            status: string;
            userId: string;
            planId: string | null;
        }) | null;
    } & {
        name: string | null;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    })[]>;
    deleteMember(gymId: string, memberId: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
    getProfile(userId: string): Promise<({
        gym: {
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
        } | null;
        membership: ({
            plan: {
                name: string;
                id: string;
                gymId: string;
                createdAt: Date;
                price: number;
                durationMonths: number;
                features: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date;
            status: string;
            userId: string;
            planId: string | null;
        }) | null;
    } & {
        name: string | null;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }) | null>;
    updateProfile(userId: string, data: any): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
    getMemberAdmin(adminGymId: string, memberId: string): Promise<({
        membership: ({
            plan: {
                name: string;
                id: string;
                gymId: string;
                createdAt: Date;
                price: number;
                durationMonths: number;
                features: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date;
            status: string;
            userId: string;
            planId: string | null;
        }) | null;
    } & {
        name: string | null;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }) | null>;
    updateMemberAdmin(adminGymId: string, memberId: string, data: any): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
    changePassword(userId: string, data: any): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
}
