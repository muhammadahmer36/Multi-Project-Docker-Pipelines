const setCookieItem = (key: string, value: string) => {
  document.cookie = `${key}=${value}; path=/`;
};

const removeCookie = (key: string) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const getCookie = (key: string) => {
  const cookies = document.cookie.split(';');
  const foundCookie = cookies.find((cookie) => {
    const [cookieKey] = cookie.trim().split('=');
    return cookieKey === key;
  });

  if (foundCookie) {
    const [, cookieValue] = foundCookie.trim().split('=');
    return decodeURIComponent(cookieValue);
  }

  return '';
};

export const rememberUserName = (rememberMe: boolean, userName: string) => {
  if (rememberMe) {
    setCookieItem('userName', userName);
    setCookieItem('isRemember', 'true');
  } else {
    removeCookie('userName');
    removeCookie('isRemember');
  }
};
