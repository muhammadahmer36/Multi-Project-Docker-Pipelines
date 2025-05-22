import { Dashboard } from 'pages/dashboard/types';

export interface ApiResponse {
  list?: [];
  status: number;
  isSuccessfull?: boolean;
  data: {
    token: string;
    refreshToken: string;
    userName: string;
    dashboard: Dashboard
    authenticationType: {
      authenticationTypeId: number,
      employeeNumber: number,
      employeeName: string,
      employeeEmail: string
    },
  }
  validation?: {
    statusCode?: number;
    statusMessage: string;
  }
}
