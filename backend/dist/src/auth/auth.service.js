"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailService;
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async registerAdmin(data) {
        const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const existingSubdomain = await this.prisma.gym.findUnique({ where: { subdomain: data.subdomain } });
        if (existingSubdomain) {
            throw new common_1.ConflictException('Subdomain already taken');
        }
        const gym = await this.prisma.gym.create({
            data: {
                name: data.gymName,
                subdomain: data.subdomain,
            },
        });
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: 'ADMIN',
                gymId: gym.id,
            },
        });
        await this.mailService.sendWelcomeEmail(user.email, null, 'ADMIN', undefined, gym.name);
        return { message: 'Admin and Gym registered successfully' };
    }
    async registerMember(data) {
        const gym = await this.prisma.gym.findUnique({ where: { subdomain: data.subdomain } });
        if (!gym)
            throw new common_1.UnauthorizedException('Invalid gym subdomain');
        const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new common_1.ConflictException('Email already in use');
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name || null,
                phone: data.phone || null,
                gender: data.gender || null,
                role: 'MEMBER',
                gymId: gym.id,
            },
        });
        let months = 1;
        let planId = null;
        if (data.planId) {
            const plan = await this.prisma.plan.findUnique({ where: { id: data.planId } });
            if (plan && plan.gymId === gym.id) {
                months = plan.durationMonths;
                planId = plan.id;
            }
        }
        else if (data.planMonths) {
            months = parseInt(data.planMonths || '1');
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + months);
        await this.prisma.membership.create({
            data: {
                userId: user.id,
                planId,
                startDate,
                endDate,
                status: 'ACTIVE',
            }
        });
        await this.mailService.sendWelcomeEmail(user.email, user.name, 'MEMBER', undefined, gym.name);
        return { message: 'Member registered successfully' };
    }
    async login(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
            include: { gym: true }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (data.subdomain && user.gym?.subdomain !== data.subdomain) {
            throw new common_1.UnauthorizedException('Invalid gym subdomain');
        }
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role, gymId: user.gymId };
        return {
            access_token: this.jwtService.sign(payload),
            role: user.role,
        };
    }
    async forgotPassword(data) {
        const { email, subdomain } = data;
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { gym: true }
        });
        if (!user || (subdomain && user.gym?.subdomain !== subdomain)) {
            return { message: 'If an account with that email exists, a reset link has been sent.' };
        }
        const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });
        await this.mailService.sendPasswordResetEmail(user.email, user.name, token, user.gym?.name || 'FitShit', subdomain || '');
        return { message: 'If an account with that email exists, a reset link has been sent.' };
    }
    async resetPassword(data) {
        const { token, newPassword } = data;
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        return { message: 'Password has been reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map