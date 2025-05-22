export interface CertifyItem {
    id: number;
    completed: 'Y' | 'N';
    approved: 'Y' | 'N';
    payperiod_title: string;
    reported_duration: number;
    calculated_duration: number;
  }

export interface InitialState {
    certifyList: CertifyItem[],
    unCertifyList: CertifyItem[],
    date: string;
  }

export interface TimesheetListPayload {
    date: string
}
