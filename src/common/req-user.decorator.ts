import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';

export const ReqUser = createParamDecorator<unknown, ExecutionContext>(
  (_, context) =>
    GqlExecutionContext.create(context).getContext<ExpressContext>().req.user,
);
