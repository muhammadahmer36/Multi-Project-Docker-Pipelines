export interface IActiveDirectoryLoginSuccess {
    token:string;
    refreshToken:string;
}

export interface IFormActiveDirectoryLogin {
    userName: string;
    password: string;
    rememberMe: boolean;
}

export interface ILoginActiveDirectoryPayload {
    loginName: string;
    password: string;
    deviceId: string;
    deviceName: string
}
