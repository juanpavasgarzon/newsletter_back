import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from './use-cases/login.use-case';
import { LoginInputDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  login(@Body() body: LoginInputDto) {
    return this.loginUseCase.run(body.secret);
  }
}
