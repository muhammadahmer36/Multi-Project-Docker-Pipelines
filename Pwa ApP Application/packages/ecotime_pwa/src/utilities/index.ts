import jwt from 'jwt-decode';
import { APP_URL } from 'enviroments';
import {
  AuthenticationMethods, buttonLogOut, commaseperatedAndRemoveBrTagRegex,
  activeDirectoryLogin, login, samlAuthentication,
} from 'appConstants';
import { ListItem } from 'components/DropDown/types';
import { getFormattedDuration } from '../core/utils';

type HeadersType = {
  [key: string]: string;
};

type sessionData = {
  [key: string]: string;
};

function handleLogoutOnRefrehTokenExpire() {
  document.getElementById(buttonLogOut)?.click();
}

export const getAccessToken = () => {
  const accessToken = sessionStorage.getItem('accessToken');
  return accessToken || null;
};

function getAuthorizationHeader(isAuthorizedRequest: boolean) {
  const authHeader: HeadersType = isAuthorizedRequest
    ? { Authorization: `Bearer ${getAccessToken()}` }
    : {};
  return authHeader;
}

function isTokenExpired() {
  const bearerToken = getAccessToken();
  if (bearerToken === null) {
    return false;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  const token: { exp: number } = jwt(bearerToken);
  return currentTime > token.exp;
}

async function refreshAccessToken() {
  try {
    const response = await fetch(`${APP_URL}/api/Authentication/RefreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: getAccessToken(),
        refreshToken: sessionStorage.getItem('refreshToken'),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      handleLogoutOnRefrehTokenExpire();
    }

    sessionStorage.setItem('accessToken', data?.data?.accessToken);
    sessionStorage.setItem('refreshToken', data?.data?.refreshToken);

    return true;
  } catch (error) {
    throw new Error('Error refreshing access token:');
  }
}

export interface Params {
  [key: string]: string | number | null | undefined;
}
export async function genericGet(
  endPoint: string,
  headers: Record<string, string> = {},
  isAuthorizedRequest = false,
  params?: Params,
) {
  try {
    if (isAuthorizedRequest) {
      if (isTokenExpired()) {
        await refreshAccessToken();
      }
    }

    const url = `${APP_URL}/api/${endPoint}`;
    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    const response = await fetch(url + queryString, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeader(isAuthorizedRequest),
        ...headers,
      },
    });
    const { status } = response;
    if (!response.ok) {
      throw new Error('An error occurred while making the GET request.');
    }
    const responseData = await response.json();
    const sucRes = {
      list: responseData,
      status,
    };
    return sucRes;
  } catch (err) {
    throw new Error(`Error: ${err}`);
  }
}

export async function genericPost(
  endPoint: string,
  data: object,
  headers: Record<string, string> = {},
  isAuthorizedRequest = false,
) {
  try {
    if (isAuthorizedRequest) {
      if (isTokenExpired()) {
        await refreshAccessToken();
      }
    }
    const response = await fetch(`${APP_URL}/api/${endPoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeader(isAuthorizedRequest),
        ...headers,
      },
      body: JSON.stringify(data),
    });
    const { status } = response;
    if (!response.ok) {
      throw new Error('An error occurred while making the POST request.');
    }
    const responseData = await response.json();
    responseData.status = status;
    return responseData;
  } catch (err) {
    throw new Error(`Error: ${err}`);
  }
}

export function getLoginConfiguration(configurationResponse: number) {
  let targetPath = '';

  switch (configurationResponse) {
    case AuthenticationMethods.ApplicationBasedAuthentication:
      targetPath = login;
      break;
    case AuthenticationMethods.ActiveDirectory:
      targetPath = activeDirectoryLogin;
      break;
    case AuthenticationMethods.Saml:
      targetPath = samlAuthentication;
      break;
    default:
      break;
  }

  return targetPath;
}

export function extractString(text: string): {
  lastWord: string;
  restWords: string;
} {
  const words = text.split(/\s+/);

  if (words.length > 0) {
    const lastWord = words.pop();
    const restWords = words.join(' ');
    return { lastWord: lastWord ?? '', restWords };
  }

  return { lastWord: '', restWords: '' };
}

export function obscureEmail(email: string) {
  if (email) {
    const startIndex = Math.max(email.length - 6, 0);
    const lastSixChars = email.substring(startIndex);
    return `${email.substring(0, 3)}*****${lastSixChars}`;
  }
  return '';
}

export function setSession(authData: sessionData) {
  try {
    sessionStorage.setItem('accessToken', authData.token);
    sessionStorage.setItem('refreshToken', authData.refreshToken);
  } catch (error) {
    console.error('Error setting session:', error);
  }
}

export function blockUserWritingEmoji(input: string) {
  return /[^\u0020-\u007E]+/.test(input);
}

export function checkNullOrUndefined(obj: object | null | undefined) {
  return (
    obj === null
    || obj === undefined
    || Object.values(obj).some((value) => value === null || value === undefined)
  );
}

function extractFirstAndLastName(names: string[]) {
  const firstName = names[0].trim();
  const lastName = names[names.length - 1].trim();
  return { firstName, lastName };
}

export function getInitialsOfFirstAndLastName(username: string) {
  if (!username) {
    return '';
  }

  const names = username.includes(',')
    ? username.split(',')
    : username.split(' ');

  if (names.length === 1) {
    const firstNameInitial = names[0].trim()[0];
    return `${firstNameInitial}`;
  }

  const { firstName, lastName } = extractFirstAndLastName(names);

  const firstNameInitial = firstName[0].toUpperCase();
  const lastNameInitial = lastName[0].toUpperCase();

  return `${firstNameInitial}${lastNameInitial}`;
}

export function getUUID() {
  return crypto.randomUUID();
}

export function extractStringAgainstKeyWord(text: string, keyword: string) {
  const index = text.indexOf(keyword);
  let restWords = '';
  let lastWord = '';
  if (index !== -1) {
    restWords = text.substring(0, index).trim();
    lastWord = text.substring(index, text.length).trim();
  }
  return { restWords, lastWord };
}

export function sortData<T>(
  data: T[],
  propertyName: keyof T,
  sortOrder: boolean,
) {
  const sortedData = [...data];
  return sortedData.sort((a, b) => {
    const valueA = a[propertyName];
    const valueB = b[propertyName];
    /* eslint-disable no-nested-ternary */
    if (sortOrder) {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    }
    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
  });
}

export const getItemFromSessionStorage = (ItemName: string) => sessionStorage.getItem(ItemName);

export const removeItemFromSessionStorage = (ItemName: string) => sessionStorage.removeItem(ItemName);

export const setItemInSessionStorage = (ItemName: string, ItemValue: string) => sessionStorage.setItem(ItemName, ItemValue);

export const durationConvertionInDeciamlForm = (durationInHours: number, durationInMinutes: number) => {
  const total = durationInHours + durationInMinutes;
  const hours = Math.floor(total);
  const minutes = Math.round((total - hours) * 60);
  return getFormattedDuration(hours, minutes);
};

export const getTimeInDecimal = (hours: number, minutes: number): number => {
  const totalHours = hours + (minutes / 60);
  return totalHours;
};

export const splitTextByCommaAndBrTag = (text: string) => {
  if (!text) return [];
  const textsArray = text.split(commaseperatedAndRemoveBrTagRegex);
  const trimmedTexts = textsArray.map((eachText) => eachText.trim());
  return trimmedTexts;
};

export const getDayString = (totalDaysOfTimeOfRequest: string) => {
  if (!totalDaysOfTimeOfRequest) return '';
  const start = totalDaysOfTimeOfRequest.indexOf('(');
  const end = totalDaysOfTimeOfRequest.indexOf(')') + 1;
  return totalDaysOfTimeOfRequest.substring(start, end);
};

export const removeFirsLetterFromString = (text: string) => {
  if (!text) return '';
  const words = text.split(' ');
  const result = words.slice(1).join(' ');
  return result;
};

export const getTotalDaysAndHours = (
  totalHours: number,
  hoursText: string,
  totalDays: string,
) => `${durationConvertionInDeciamlForm(totalHours, 0)}${hoursText} ${getDayString(totalDays)}`;

export const getListWithSeperator = (list: ListItem[]) => list.map((item) => item.code).join('|');

export const getUpdatedListForDropDown = <T extends Record<string, string>>(
  data: T[],
  codeValue: keyof T,
  descriptionValue: keyof T,
) => data.map((item) => ({
    fldId: Number(item[codeValue]),
    code: item[codeValue],
    description: item[descriptionValue],
  }));
