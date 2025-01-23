/* import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "./roles.decorator";
import { JwtService } from "@nestjs/jwt";
import { PayloadInterface } from "../interfaces/payload.interface";
import { UsersService } from "../../users/users.service";
enum Role{
  GUEST,
  ADMIN,
  CONSUMER
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let failStrategy = false;
    let roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const bizarre = roles.find(
      (role) =>
        !Object.values(Role)
          .map((rul) => rul.toString())
          .includes(role),
    );
    if (bizarre)
      throw new InternalServerErrorException(
        `Contact the Admin and inform him for this error: "An Unknown role '${bizarre}', Use Role Enumerator instead of literal strings!"`,
      );

    if (roles.length === 0 || Object.keys(roles).length === 0) return true;
    // no auth is required
    if (roles.includes(Role.GUEST)) {
      if (roles.length == 1) return true;
      failStrategy = true;
    }
    // Extracting Payload
    try {
      const request = context.switchToHttp().getRequest();
      const auth: string = request.headers["authorization"];
      if (!auth) throw new UnauthorizedException("no token found");
      console.log(auth);
      const token = auth.split(" ").pop();
      console.log(token);
      if (!token) throw new Error("Inavlid Token");
      const decodedUser: PayloadInterface = await this.jwtService.decode(token);
      console.log(decodedUser);
      //Finding User
      const user = await this.usersService.findOne(decodedUser.id);
      if (!user) throw new UnauthorizedException("Unable to find this user!");
      request.user = user;
      // appending requirements
      console.log(user);
      let appendedRoles = [...roles];
      if (appendedRoles.includes(Role.CONSUMER))
        appendedRoles.push(Role.MERCHANT);
      if (appendedRoles.includes(Role.MERCHANT)) appendedRoles.push(Role.ADMIN);

      if (!appendedRoles.includes(user.role))
        throw new ForbiddenException(
          `You don't have the Role enough to access this resource: Requires ${roles.join(", ")} but found ${user.role}`,
        );
    } catch (e) {
      if (failStrategy) return true;
      throw e;
    }
    return true;
  }
}
 */