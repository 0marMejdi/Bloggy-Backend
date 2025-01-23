import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PayloadInterface } from "src/auth/interfaces/payload.interface";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET || "0xDeadBeef",
    });
  }

  async validate(payload: PayloadInterface) {
    const user = await this.userService.findByEmail(payload.email);
    if (!user)
      throw new UnauthorizedException(
        "user provided by the token is not found",
      );
    const { password, ...result } = user;

    return result;
  }
}
