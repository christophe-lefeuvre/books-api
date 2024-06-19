import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    // Generate a salt using bcrypt
    const salt = await bcrypt.genSalt();
    // Hash the password along with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        // "23505" is a unique constraint violation in PostgreSQL.
        throw new ConflictException('Email already in use.');
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOneBy({
      email: signInDto.email,
    });

    if (!user) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    const payload = {
      id: user.id,
      email: signInDto.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
