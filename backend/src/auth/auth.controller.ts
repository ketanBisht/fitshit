import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerAdmin(@Body() body: any) {
    return this.authService.registerAdmin(body);
  }

  @Post('register-member')
  async registerMember(@Body() body: any) {
    return this.authService.registerMember(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }
}
