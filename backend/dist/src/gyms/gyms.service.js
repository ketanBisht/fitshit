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
exports.GymsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const mail_service_1 = require("../mail/mail.service");
let GymsService = class GymsService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async getGymBySubdomain(subdomain) {
        const gym = await this.prisma.gym.findUnique({
            where: { subdomain },
            select: { id: true, name: true, subdomain: true, description: true, facilities: true, instagram: true, timing: true, address: true }
        });
        if (!gym)
            throw new common_1.NotFoundException('Gym not found');
        return gym;
    }
    async getGymInfo(gymId) {
        return this.prisma.gym.findUnique({ where: { id: gymId } });
    }
    async updateGym(gymId, data) {
        return this.prisma.gym.update({
            where: { id: gymId },
            data: {
                name: data.name,
                description: data.description,
                facilities: data.facilities,
                instagram: data.instagram,
                timing: data.timing,
                address: data.address
            }
        });
    }
    async getAnnouncements(gymId) {
        return this.prisma.announcement.findMany({
            where: { gymId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createAnnouncement(gymId, content) {
        const announcement = await this.prisma.announcement.create({
            data: { gymId, content }
        });
        const now = new Date();
        const members = await this.prisma.user.findMany({
            where: {
                gymId,
                role: 'MEMBER',
                membership: {
                    status: 'ACTIVE',
                    endDate: { gte: now }
                }
            }
        });
        const gym = await this.prisma.gym.findUnique({ where: { id: gymId } });
        if (gym && members.length > 0) {
            console.log(`[Announcements] Found ${members.length} active members for ${gym.name}. Dispatching emails...`);
            await this.mailService.sendAnnouncementEmails(gym.name, content, members.map(m => m.email));
        }
        else {
            console.log(`[Announcements] No active members found for ${gym?.name || gymId}. Emails will not be sent.`);
        }
        return announcement;
    }
    async deleteAnnouncement(gymId, announcementId) {
        const exists = await this.prisma.announcement.findFirst({ where: { id: announcementId, gymId } });
        if (!exists)
            throw new common_1.NotFoundException('Announcement not found');
        return this.prisma.announcement.delete({ where: { id: announcementId } });
    }
    async getPlans(gymId) {
        return this.prisma.plan.findMany({
            where: { gymId },
            orderBy: { price: 'asc' }
        });
    }
    async getPlansBySubdomain(subdomain) {
        const gym = await this.prisma.gym.findUnique({ where: { subdomain } });
        if (!gym)
            throw new common_1.NotFoundException('Gym not found');
        return this.getPlans(gym.id);
    }
    async createPlan(gymId, data) {
        return this.prisma.plan.create({
            data: {
                gymId,
                name: data.name,
                price: data.price,
                durationMonths: data.durationMonths,
                features: data.features
            }
        });
    }
    async deletePlan(gymId, planId) {
        const exists = await this.prisma.plan.findFirst({ where: { id: planId, gymId } });
        if (!exists)
            throw new common_1.NotFoundException('Plan not found');
        return this.prisma.plan.delete({ where: { id: planId } });
    }
};
exports.GymsService = GymsService;
exports.GymsService = GymsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], GymsService);
//# sourceMappingURL=gyms.service.js.map