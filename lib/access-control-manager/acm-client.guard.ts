import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import accessControlService from "../core/acm-core";

@Injectable()
export default class AcmClient implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const IsWebhook = this.reflector.get<boolean>("IsAcmWebhook", context.getHandler());
    if (IsWebhook) return true;

    const IsPublic = this.reflector.get<boolean>("IsAcmPublic", context.getHandler());
    const IsService = this.reflector.get<boolean>("IsAcmService", context.getHandler());

    const IsDisable = this.reflector.get<boolean>("IsAcmDisable", context.getHandler());
    const IsHealth = this.reflector.get<boolean>("IsAcmHealth", context.getHandler());

    if (IsHealth) return true;

    const request = context.switchToHttp().getRequest();

    if (IsService) return accessControlService.service(request);

    if ((IsDisable != true || process.env.NODE_ENV != "development") && process.env.NODE_ENV !== "test") {
      accessControlService.client(request);
    }
    if (IsPublic) return true;

    return accessControlService.auth(request);
  }
}
