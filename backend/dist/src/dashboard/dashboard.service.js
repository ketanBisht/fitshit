"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminStats(gymId) {
        const totalMembers = await this.prisma.user.count({ where: { gymId, role: 'MEMBER' } });
        const usersDemographics = await this.prisma.user.findMany({
            where: { gymId, role: 'MEMBER' },
            select: { gender: true }
        });
        const memberships = await this.prisma.membership.findMany({
            where: { user: { gymId, role: 'MEMBER' } },
            include: { plan: true }
        });
        const payments = await this.prisma.payment.findMany({
            where: { user: { gymId, role: 'MEMBER' } }
        });
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);
        let active = 0;
        let expired = 0;
        let expiringSoon = 0;
        let totalRevenue = 0;
        memberships.forEach((m) => {
            if (m.endDate < now) {
                expired++;
            }
            else {
                active++;
                if (m.endDate <= sevenDaysFromNow) {
                    expiringSoon++;
                }
            }
        });
        const revenueMap = new Map();
        payments.forEach((p) => {
            totalRevenue += p.amount;
            const monthYear = p.date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            revenueMap.set(monthYear, (revenueMap.get(monthYear) || 0) + p.amount);
        });
        const genderMap = new Map();
        usersDemographics.forEach((u) => {
            const gender = u.gender || 'Other';
            genderMap.set(gender, (genderMap.get(gender) || 0) + 1);
        });
        const planMap = new Map();
        memberships.forEach((m) => {
            if (m.plan && m.plan.name) {
                planMap.set(m.plan.name, (planMap.get(m.plan.name) || 0) + 1);
            }
        });
        const gym = await this.prisma.gym.findUnique({ where: { id: gymId }, select: { name: true } });
        return {
            totalMembers,
            activeMembers: active,
            expiredMembers: expired,
            expiringSoon,
            totalRevenue,
            gymName: gym?.name || 'FitShit',
            revenueTrend: Array.from(revenueMap.entries()).map(([name, revenue]) => ({ name, revenue })).reverse(),
            genderDistribution: Array.from(genderMap.entries()).map(([name, count]) => ({ name, count })),
            planDistribution: Array.from(planMap.entries()).map(([name, count]) => ({ name, count }))
        };
    }
    async getMemberStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                gym: {
                    select: {
                        name: true,
                        announcements: { orderBy: { createdAt: 'desc' }, take: 5 }
                    }
                },
                membership: {
                    include: { plan: true }
                }
            }
        });
        if (!user?.membership)
            return { message: 'No active membership', status: 'NONE', gym: user?.gym };
        const membership = user.membership;
        const now = new Date();
        const diffTime = new Date(membership.endDate).getTime() - now.getTime();
        const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        let status = 'ACTIVE';
        if (daysRemaining === 0)
            status = 'EXPIRED';
        return { status, daysRemaining, expiryDate: membership.endDate, startDate: membership.startDate, plan: membership.plan, gym: user.gym, phone: user.phone };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map