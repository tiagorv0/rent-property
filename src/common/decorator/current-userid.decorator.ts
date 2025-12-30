import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user?.sub;

    if (userId && !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid User ID');
    }

    return userId;
  },
);
