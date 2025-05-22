export const getPayloadFromJwt = (jwtToken: string) => {
  try {
    const parts = jwtToken.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  }    
   catch (error) {
    return  ''  
  }
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const setValueInSessionStorage = (key: string, value: any) => {
    try {
     sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        return null;
    }
  };
  
  export const getValueFromSessionStorage = (key: string) => {
    try {
      const value = sessionStorage.getItem(key);
      if(value)
      {
        return JSON.parse(value);
      }
      return null

    } catch (error) {
      return null;
    }
  };