import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";

/**
 * Gets the current user object (without his password ofc!)
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user)
      throw new UnauthorizedException("Login first! (No user object found)");
    const user: User = request.user;
    return user;
  },
);
