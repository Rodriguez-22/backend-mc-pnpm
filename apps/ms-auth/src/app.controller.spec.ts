import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './app.controller';
import { AuthService } from './app.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  // Aquí deberías agregar tests reales para AuthController
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
