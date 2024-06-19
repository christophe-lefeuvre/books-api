import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserData } from 'src/auth/interface/current-user-data.interface';

export const CurrentUser = createParamDecorator(
  (field: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUserData = request.user;

    return field ? user[field] : user;
  },
);
