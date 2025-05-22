export interface IRegistration {
    employeeNumber: string;
    userName: string,
    employeeEmail: string,
    phone: string,
}

export interface ISamlLoginPayload {
  loginName: string | undefined;
  deviceId: string;
  employeenumber: unknown;
  deviceName: string;
}

export interface ILoginPayload extends ISamlLoginPayload {
  password: string;
}

export interface ISetValue extends IRegistration {
    employeeName: string;
}
