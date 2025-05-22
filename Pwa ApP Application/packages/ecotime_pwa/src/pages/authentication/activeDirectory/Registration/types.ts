export interface IRegistration {
    employeeNumber: string;
    userName: string,
    employeeEmail: string,
    phone: string,
}

export interface IRegistrationActiveDirectoryPayload {
    employeeNumber: string,
    loginName: string,
    password: string,
    confirmPassword: string,
    emailAddress: string,
    mobileNumber: string,
}

export interface ISetValue extends IRegistration {
    employeeName: string;
}

export interface IValidation {
    statusCode: number;
    statusMessage: string;
}
