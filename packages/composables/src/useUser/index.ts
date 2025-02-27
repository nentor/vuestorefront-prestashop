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
    const cookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const cookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    const key = context.$prestashop.config.app.$cookies.get(cookieKey);
    const value = context.$prestashop.config.app.$cookies.get(cookieValue);
    if (key && value) {
      const result: any = await context.$prestashop.api.loadCustomer({key, value});
      if (result.code === 410) {
        return null;
      }
      return result.psdata;
    } else {
      return null;
    }

    // todo: setup User type
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logOut: async (context: Context) => {
    const cookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const cookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    context.$prestashop.config.app.$cookies.remove(cookieKey);
    context.$prestashop.config.app.$cookies.remove(cookieValue);

    // todo: call logout api
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    const vsfCookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const vsfCookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    const psCookieKey = context.$prestashop.config.app.$cookies.get(vsfCookieKey);
    const psCookieValue = context.$prestashop.config.app.$cookies.get(vsfCookieValue);
    const { data, cookieObject } = await context.$prestashop.api.updateCustomer({ psCookieKey, psCookieValue, updatedUserData });
    if (data.success) {
      if (cookieObject) {
        context.$prestashop.config.app.$cookies.set(vsfCookieKey, cookieObject.vsfPsKeyCookie);
        context.$prestashop.config.app.$cookies.set(vsfCookieValue, cookieObject.vsfPsValCookie);
      }
      const cookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
      const cookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

      const key = context.$prestashop.config.app.$cookies.get(cookieKey);
      const value = context.$prestashop.config.app.$cookies.get(cookieValue);
      if (key && value) {
        const result: any = await context.$prestashop.api.loadCustomer({key, value});
        return result.psdata;
      }
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: async (context: Context, { email, password, firstName, lastName }) => {
    const vsfCookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const vsfCookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    const psCookieKey = context.$prestashop.config.app.$cookies.get(vsfCookieKey);
    const psCookieValue = context.$prestashop.config.app.$cookies.get(vsfCookieValue);

    const {data, cookieObject} = await context.$prestashop.api.register({email, password, firstName, lastName, psCookieKey, psCookieValue});

    const code = data.code;

    if (code === 200) {
      context.$prestashop.config.app.$cookies.set(vsfCookieKey, cookieObject.vsfPsKeyCookie);
      context.$prestashop.config.app.$cookies.set(vsfCookieValue, cookieObject.vsfPsValCookie);

      const result: any = await context.$prestashop.api.loadCustomer({key: cookieObject.vsfPsKeyCookie, value: cookieObject.vsfPsValCookie});
      if (result.code === 410) {
        return {};
      }
      return result.psdata;

    } else if (code === 306) {
      throw {
        message: 'Registration failed'
      };
    }

    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logIn: async (context: Context, { username, password }) => {
    const vsfCookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const vsfCookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    const psCookieKey = context.$prestashop.config.app.$cookies.get(vsfCookieKey);
    const psCookieValue = context.$prestashop.config.app.$cookies.get(vsfCookieValue);

    const {data, cookieObject} = await context.$prestashop.api.login({username, password, psCookieKey, psCookieValue});
    const code = data.code;

    if (code === 200) {
      context.$prestashop.config.app.$cookies.set(vsfCookieKey, cookieObject.vsfPsKeyCookie);
      context.$prestashop.config.app.$cookies.set(vsfCookieValue, cookieObject.vsfPsValCookie);

    } else if (code === 306) {
      throw {
        message: 'The provided credentials are invalid'
      };
    }

    return data.psdata.user;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (context: Context, { currentUser, currentPassword, newPassword, customQuery }) => {
    const updatedUserData = {
      password: currentPassword,
      // eslint-disable-next-line camelcase
      new_password: newPassword,
      ...customQuery
    };
    const vsfCookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
    const vsfCookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

    const psCookieKey = context.$prestashop.config.app.$cookies.get(vsfCookieKey);
    const psCookieValue = context.$prestashop.config.app.$cookies.get(vsfCookieValue);
    const { data, cookieObject } = await context.$prestashop.api.updateCustomer({ psCookieKey, psCookieValue, updatedUserData });
    if (data.success) {
      if (cookieObject) {
        context.$prestashop.config.app.$cookies.set(vsfCookieKey, cookieObject.vsfPsKeyCookie);
        context.$prestashop.config.app.$cookies.set(vsfCookieValue, cookieObject.vsfPsValCookie);
      }
      const cookieKey = context.$prestashop.config.app.$config.psCustomerCookieKey;
      const cookieValue = context.$prestashop.config.app.$config.psCustomerCookieValue;

      const key = context.$prestashop.config.app.$cookies.get(cookieKey);
      const value = context.$prestashop.config.app.$cookies.get(cookieValue);
      if (key && value) {
        const result: any = await context.$prestashop.api.loadCustomer({key, value});
        return result.psdata;
      }
    }
  }
};

export const useUser = useUserFactory<User, UpdateParams, RegisterParams>(params);
