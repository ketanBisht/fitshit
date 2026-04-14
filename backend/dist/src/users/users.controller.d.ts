import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<({
        gym: {
            id: string;
            name: string;
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
                id: string;
                name: string;
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
            userId: string;
            planId: string | null;
            startDate: Date;
            endDate: Date;
            status: string;
        }) | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }) | null>;
    updateProfile(body: any, req: any): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
    changePassword(body: any, req: any): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
    createMember(body: any, req: any): Promise<{
        message: string;
        id: string;
    }>;
    createBulkMembers(data: any[], req: any): Promise<{
        message: string;
        total: number;
        skipped: number;
    }>;
    getMembers(req: any): Promise<({
        membership: ({
            plan: {
                id: string;
                name: string;
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
            userId: string;
            planId: string | null;
            startDate: Date;
            endDate: Date;
            status: string;
        }) | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    })[]>;
    deleteMember(id: string, req: any): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
    getMember(id: string, req: any): Promise<({
        membership: ({
            plan: {
                id: string;
                name: string;
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
            userId: string;
            planId: string | null;
            startDate: Date;
            endDate: Date;
            status: string;
        }) | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }) | null>;
    updateMember(id: string, body: any, req: any): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
    }>;
}
