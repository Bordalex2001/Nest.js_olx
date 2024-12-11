import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService
  ) {}
  
  async signUp(registerDto: RegisterDto): Promise<any> {
    const { email, password, first_name, last_name, phone_number, location, about_user } = registerDto;
    
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      this.logger.error(`Email conflict: ${email}`);
      throw new ConflictException('User with this email already exists');
    }
    
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({ 
      first_name,
      last_name,
      email, 
      password: passwordHash,
      phone_number,
      location,
      about_user
    });

    this.logger.log(`User registered with email: ${email}`);
    return { message: 'User registered successfully', userId: user.id };
  }

  async signIn(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ where: { email }});
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.error(`Invalid credentials for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`User authorized with email: ${email}`);
    return { accessToken };
  }

  async findAll() {
    return await this.userModel.findAll();
  }

  async findOne(id: number) {
    return await this.userModel.findByPk(id);
  }

  async update(id: number, updateUserDto) {
    const rows = await this.userModel.update(updateUserDto, {
      where: { id }
    });
    this.logger.log(`Update row ${rows}`);
    if(rows[0]){
      return { id, ...updateUserDto };
    }
    return `User #${id} not found`;
  }

  async remove(id: number) {
    const rows = await this.userModel.destroy
    ({
      where: { id }
    });
    this.logger.log(`Delete row ${rows}`);
    if(rows[0]){
      return `User #${id} has been removed`;
    }
    return `User #${id} not found`;
  }
}