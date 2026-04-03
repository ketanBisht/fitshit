import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerAdmin(data: any) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const existingSubdomain = await this.prisma.gym.findUnique({ where: { subdomain: data.subdomain } });
    if (existingSubdomain) {
      throw new ConflictException('Subdomain already taken');
    }

    // Create Gym and Admin
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

    return { message: 'Admin and Gym registered successfully' };
  }

  async registerMember(data: any) {
    const gym = await this.prisma.gym.findUnique({ where: { subdomain: data.subdomain } });
    if (!gym) throw new UnauthorizedException('Invalid gym subdomain');

    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'MEMBER',
        gymId: gym.id,
      },
    });

    // Mock purchase: Create Membership based on plan length
    const months = parseInt(data.planMonths || '1');
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    await this.prisma.membership.create({
      data: {
        userId: user.id,
        startDate,
        endDate,
        status: 'ACTIVE',
      }
    });

    return { message: 'Member registered successfully' };
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({ 
      where: { email: data.email },
      include: { gym: true }
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (data.subdomain && user.gym?.subdomain !== data.subdomain) {
      throw new UnauthorizedException('Invalid gym subdomain');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, gymId: user.gymId };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
