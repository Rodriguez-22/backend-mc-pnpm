import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Escucha el mensaje 'auth.register.user'
  @MessagePattern('auth.register.user')
  registerUser(@Payload() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  // Escucha el mensaje 'auth.login.user'
  @MessagePattern('auth.login.user')
  loginUser(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  // Escucha el mensaje para validar un token (útil para el API Gateway)
  @MessagePattern('auth.verify.token')
  verifyToken(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }
}