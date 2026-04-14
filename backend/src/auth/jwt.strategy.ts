import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secret-key-for-mvp', // Hardcoded for MVP simplicity
    });
  }

  async validate(payload: any) {
    console.log('--- AUTH LOG ---');
    console.log('Payload from token:', JSON.stringify(payload));
    const userRole = payload.role;
    console.log('Detected Role:', userRole);
    console.log('----------------');
    return { userId: payload.sub, email: payload.email, role: userRole, gymId: payload.gymId };
  }
}
