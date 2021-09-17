import { dedupExchange, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  ChangePasswordMutation,
} from '../generated/graphql';
import { updateQuery } from './updateQuery';

export const createURQLCLient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          changePassword: (
            _result: ChangePasswordMutation,
            args,
            cache,
            info
          ) => {
            updateQuery<ChangePasswordMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.changePassword.errors) {
                  return query;
                } else {
                  return {
                    me: result.changePassword.user,
                  };
                }
              }
            );
          },
          login: (_result: LoginMutation, args, cache, info) => {
            updateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result: RegisterMutation, args, cache, info) => {
            updateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
          logout: (_result: LogoutMutation, args, cache, info) => {
            updateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => {
                return { me: null };
              }
            );
          },
        },
      },
    }),
    fetchExchange,
    ssrExchange,
  ],
});
