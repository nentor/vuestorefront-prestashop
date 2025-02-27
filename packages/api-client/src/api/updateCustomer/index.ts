
import { cookieParser } from '../../helpers/cookieParser';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function updateCustomer(context, params) {
  const { updatedUserData } = params;
  const url = new URL('/rest/accountedit', context.config.api.url);
  const { data, headers } = await context.client.post(url.href, updatedUserData, {
    headers: {
      Cookie: params.psCookieKey + '=' + params.psCookieValue + ';'
    }
  });
  const cookieObject = cookieParser(headers);
  return {data, cookieObject};
}
