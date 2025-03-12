import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateOAuthLogin(profile: any): Promise<any> {
    // In this method, you can check if the user exists in your database
    // If not, create the user, and return the user object

    // For simplicity, assuming the user is fetched or created
    const user = { id: profile._id, email: profile.email }; // Example user object

    // Generate JWT after successful login
    return this.generateJwt(user);
  }

  generateJwt(user: any): string {
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '10h' });
  }

  async generateTestJwt(user: any): Promise<any> {
    const payload = { displayName: user.name, emails: [{ value: user.email }] };
    let result: any = await this.usersService.findOrCreate(payload);
    return this.jwtService.sign(
      { userId: result._id, email: result.email },
      { expiresIn: '10h' },
    );
  }
}
