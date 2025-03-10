import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate OAuth login and generate JWT', async () => {
    const profile = { id: '123', emails: [{ value: 'test@example.com' }] };
    const user = { id: '123', email: 'test@example.com' };
    const token = 'jwt-token';

    jest.spyOn(service, 'generateJwt').mockReturnValue(token);

    const result = await service.validateOAuthLogin(profile);
    expect(result).toEqual(token);
    expect(service.generateJwt).toHaveBeenCalledWith(user);
  });

  it('should generate JWT', () => {
    const user = { id: '123', email: 'test@example.com' };
    const token = 'jwt-token';

    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = service.generateJwt(user);
    expect(result).toEqual(token);
    expect(jwtService.sign).toHaveBeenCalledWith(
      { userId: user.id, email: user.email },
      { expiresIn: '10h' },
    );
  });
});
