export interface sagaInterface {
    type: string
    payload: object
}

export interface userForgotAndResendInterface extends sagaInterface {
    forResend: boolean;
}
