import { cookieParser } from '../../helpers/cookieParser';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function setShippingMethod(context, params) {
  const { shippingMethodId, addressId } = params;
  // eslint-disable-next-line camelcase
  const body = { id_address: addressId, id_carrier: shippingMethodId };
  const url = new URL('/rest/setcarriercheckout', context.config.api.url);

  const { data, headers } = await context.client.post(url.href, body, {
    headers: {
      Cookie: params.psCookieKey + '=' + params.psCookieValue + ';'
    }
  }
  );
  const cookieObject = cookieParser(headers);
  return {data, cookieObject};
}
