export interface ReducerInterface {
    type: string;
    payload: {
        email: string;
        token: string;
        userName: string;
        refreshToken: string;
        employeeName: string,
        employeeData: string,
        employeeDetail: {
            authenticationTypeId: number;
            employeeEmail: string;
            employeeName: string;
            employeeNumber: string;
        }
    };
    data: {
        authenticationType: {
            authenticationTypeId: number;
            employeeEmail: string;
            employeeName: string;
            employeeNumber: string;
        }
        employeeDetail: {
            authenticationTypeId: number;
            employeeEmail: string;
            employeeName: string;
            employeeNumber: string;
        }
    }
}
