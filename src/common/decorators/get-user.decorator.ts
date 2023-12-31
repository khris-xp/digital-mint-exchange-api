import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return data ? request.user && request.user?.[data] : request.user;
  },
);
