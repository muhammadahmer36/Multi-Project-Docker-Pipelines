export interface IRegistration {
  employeeNumber: string;
  userName: string;
  employeeEmail: string;
  phone: string;
}

export interface IRegistrationPayload {
    payload: IRegistration
    type: string;
}
