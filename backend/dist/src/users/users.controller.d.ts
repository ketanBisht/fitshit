import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createMember(body: any, req: any): Promise<{
        message: string;
        id: string;
    }>;
    createBulkMembers(data: any[], req: any): Promise<{
        message: string;
    }>;
    getMembers(req: any): Promise<({
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
        createdAt: Date;
    })[]>;
    deleteMember(id: string, req: any): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        gender: string | null;
        role: string;
        gymId: string | null;
        createdAt: Date;
    }>;
}
