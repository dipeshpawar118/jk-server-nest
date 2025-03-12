import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class AuthService {
  private readonly logger = new CustomLogger();

  constructor(
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateOAuthLogin(profile: any): Promise<any> {
    this.logger.log(`Validating OAuth login for profile: ${profile.email}`);
    // In this method, you can check if the user exists in your database
    // If not, create the user, and return the user object

    // For simplicity, assuming the user is fetched or created
    const user = { id: profile._id, email: profile.email }; // Example user object

    // Generate JWT after successful login
    return this.generateJwt(user);
  }

  generateJwt(user: any): string {
    this.logger.log(`Generating JWT for user: ${user.email}`);
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '10h' });
  }

  async generateTestJwt(user: any): Promise<any> {
    this.logger.log(`Generating test JWT for user: ${user.email}`);
    const payload = { displayName: user.name, emails: [{ value: user.email }] };
    let result: any = await this.usersService.findOrCreate(payload);
    return this.jwtService.sign(
      { userId: result._id, email: result.email },
      { expiresIn: '10h' },
    );
  }
}
