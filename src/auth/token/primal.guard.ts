import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
} from "@nestjs/common";

import { AuthService } from "../auth.service";
import { Request } from "express";

@Injectable()
export class PrimalJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    throw new NotImplementedException();
    const req: Request = context.switchToHttp().getRequest();
    // const res = await this.authService.validateReq(req);
    // console.log(res);

    // return Boolean(res);
  }
}
