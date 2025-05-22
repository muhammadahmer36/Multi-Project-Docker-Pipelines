import {
  SAML_TENANTID,
  SAML_AUTHORITY,
  SAML_CLIENTID,
} from 'enviroments';

import {
  samlAuthentication,
} from 'appConstants';

export const msalConfig = {
  auth: {
    tenantId: `${SAML_TENANTID}`,
    clientId: `${SAML_CLIENTID}`,
    authority: `${SAML_AUTHORITY}`,
    redirectUri: `${samlAuthentication}`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ['user.read'],
};
