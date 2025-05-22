import {
  AuthenticationResult,
  EventCallbackFunction,
  EventMessage,
  EventType,
  PublicClientApplication,
} from '@azure/msal-browser';
import { msalConfig } from 'pages/authentication/saml/microsoftAuthentication/samlconfig';
import { setItemInSessionStorage } from 'utilities';

const initializeMsal = () => {
  const msalInstance = new PublicClientApplication(msalConfig);
  const activeAccount = msalInstance.getActiveAccount();
  const allAccounts = msalInstance.getAllAccounts();

  if (activeAccount && allAccounts.length > 0) {
    msalInstance.setActiveAccount(activeAccount);
  }

  function eventCallback(message: EventMessage): void {
    const { eventType, payload } = message;
    if (eventType === EventType.LOGIN_SUCCESS && payload) {
      const samlResponse = payload as AuthenticationResult;
      const { account, idToken } = samlResponse;
      setItemInSessionStorage('idToken', idToken);
      msalInstance?.setActiveAccount(account);
    }
  }

  msalInstance.addEventCallback(eventCallback as EventCallbackFunction);

  return msalInstance;
};

export default initializeMsal;
