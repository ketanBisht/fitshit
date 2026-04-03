import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createMember(data: any, adminGymId: string): Promise<{
        message: string;
        id: string;
    }>;
    createMembersBulk(members: any[], adminGymId: string): Promise<{
        message: string;
    }>;
    getMembers(gymId: string): Promise<({
        membership: ({
            plan: {
                id: string;
                gymId: string;
                createdAt: Date;
                name: string;
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
        id: string;
        email: string;
        password: string;
        phone: string | null;
        role: string;
        gymId: string | null;
        createdAt: Date;
    })[]>;
}
