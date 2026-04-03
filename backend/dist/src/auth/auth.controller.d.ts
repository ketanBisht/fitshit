import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerAdmin(body: any): Promise<{
        message: string;
    }>;
    registerMember(body: any): Promise<{
        message: string;
    }>;
    login(body: any): Promise<{
        access_token: string;
        role: string;
    }>;
}
