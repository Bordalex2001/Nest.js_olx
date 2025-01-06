import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token } from 'src/user/models/token.model';
import { JwtStrategy } from './jwt.strategy';

//Зробити аутентифікацію користувача, з БД працювати через ORM
//Реалізувати в моделях зв'язки між таблицями
//У моделі додати зв'язки між таблицями, реалізуйте відновлення пароля користувача (через пошту)
@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User, Token]),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return {
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string | number>('JWT_EXPIRES_IN')
                }
            }
        }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  exports: [JwtStrategy, PassportModule, SequelizeModule]
})
export class UserModule {}
