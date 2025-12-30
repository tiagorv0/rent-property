import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/apps/user/user.service';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string | null> {
    const user = await this.userService.getUserByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (passwordMatch) {
      const payload = {
        sub: user._id.toString(),
        email: user.email,
        username: user.username,
        name: user.name,
      };
      return this.jwtService.sign(payload);
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }
}
