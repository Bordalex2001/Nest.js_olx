import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/sequelize";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./models/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: { id: string }): Promise<User> {
        const { id } = payload;
        const user = await this.userModel.findByPk(id);

        if (!user) {
            throw new UnauthorizedException('Login first to access this endpoint');
        }

        return user;
    }
}