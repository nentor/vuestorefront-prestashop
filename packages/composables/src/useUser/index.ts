import {
  Context,
  useUserFactory,
  UseUserFactoryParams
} from '@vue-storefront/core';
import type { User } from '@vue-storefront/prestashop-api';
import type {
  UseUserUpdateParams as UpdateParams,
  UseUserRegisterParams as RegisterParams
} from '../types';

const params: UseUserFactoryParams<User, UpdateParams, RegisterParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context) => {
    console.log('Mocked: useUser.load');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logOut: async (context: Context) => {
    console.log('Mocked: useUser.logOut');
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    console.log('Mocked: useUser.updateUser');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: async (context: Context, { email, password, firstName, lastName }) => {
    console.log('Mocked: useUser.register');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logIn: async (context: Context, { username, password }) => {
    const {data, cookieObject} = await context.$prestashop.api.login({username, password});

    const cookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const cookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;
    const code = data.code;

    if (code === 200) {
      context.$prestashop.config.app.$cookies.set(cookieKey, cookieObject.vsfPsKeyCookie);
      context.$prestashop.config.app.$cookies.set(cookieValue, cookieObject.vsfPsValCookie);

    } else if (code === 306) {
      // authentication failed
    }

    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (context: Context, { currentUser, currentPassword, newPassword }) => {
    console.log('Mocked: useUser.changePassword');
    return {};
  }
};

export const useUser = useUserFactory<User, UpdateParams, RegisterParams>(params);
