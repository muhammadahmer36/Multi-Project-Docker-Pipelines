interface ValidationData {
    statusMessage: string;
    statusCode: number;
}

export interface ResponseRedux {
    applicationBasedAuthorizationResponse: {
        token: string;
        refreshToken: string;
        codeForUser: string;
        userName: string;
        rememberMe: boolean;
        isAccountExpire: boolean;
        registeredUserResponse: string;
        loginToConfrmCode: boolean;
        shouldUserNavigated: boolean;
        fieldsDisableRegistration2: boolean;
        isAccountDeactivated: boolean;
        successfullUser: {
            employeeNumber: string,
            employeeName: string,
            employeeEmail: string
        }
        passwordExpireValidation: ValidationData;
        registrationStepTwoValues: {
            userName: string,
            password: string,
            confirmPassword: string,
            phone: string,
        }
        loginData: {
            loginName: string;
            rememberMe: boolean;
        }
        validation: ValidationData
        loginValidation: ValidationData
        userDataForUpdatePassword: {
            authenticationTypeId: number;
            employeeEmail: string;
            loginName: string;
            accountId: number;
            employeeName: string;
            employeeNumber: string;
        }
        resendCodeValidation: ValidationData;
        pwaAccessAccountDeactivate: ValidationData;
        forgetCredentials: string;
    };
}
