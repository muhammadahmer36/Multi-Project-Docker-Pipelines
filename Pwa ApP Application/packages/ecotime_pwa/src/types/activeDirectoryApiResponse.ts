import { Dashboard } from 'pages/dashboard/types';

export interface IadLoginApiResponse {
  list?: [];
  status: number;
  isSuccessfull?: boolean;
  data: {
    token: string;
    refreshToken: string;
    dateTimeFormatClockWidget: string;
    userName: string;
    dashboard: Dashboard;
    employeeDetail: {
      authenticationTypeId: number;
      loginName: string;
      employeeNumber: number;
      employeeName: string;
      employeeEmail: string;
    },
  }
  validation?: {
    statusCode?: number;
    statusMessage: string;
  }
}
