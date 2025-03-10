import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateOAuthLogin(profile: any): Promise<any> {
    // In this method, you can check if the user exists in your database
    // If not, create the user, and return the user object

    // For simplicity, assuming the user is fetched or created
    const user = { id: profile.id, email: profile.emails[0].value }; // Example user object

    // Generate JWT after successful login
    return this.generateJwt(user);
  }

  generateJwt(user: any): string {
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '10h' });
  }
}
