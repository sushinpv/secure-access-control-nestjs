"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const acm_core_1 = require("../core/acm-core");
let AcmClient = class AcmClient {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const IsWebhook = this.reflector.get("IsAcmWebhook", context.getHandler());
        if (IsWebhook)
            return true;
        const IsPublic = this.reflector.get("IsAcmPublic", context.getHandler());
        const IsService = this.reflector.get("IsAcmService", context.getHandler());
        const IsDisable = this.reflector.get("IsAcmDisable", context.getHandler());
        const IsHealth = this.reflector.get("IsAcmHealth", context.getHandler());
        if (IsHealth)
            return true;
        const request = context.switchToHttp().getRequest();
        if (IsService)
            return acm_core_1.default.service(request);
        if ((IsDisable != true || process.env.NODE_ENV != "development") && process.env.NODE_ENV !== "test") {
            acm_core_1.default.client(request);
        }
        if (IsPublic)
            return true;
        return acm_core_1.default.auth(request);
    }
};
AcmClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AcmClient);
exports.default = AcmClient;
