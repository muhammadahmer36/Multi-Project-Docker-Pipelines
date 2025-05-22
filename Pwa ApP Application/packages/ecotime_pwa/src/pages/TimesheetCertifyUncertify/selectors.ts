import { RootState } from 'redux/reducer';

export const getCertifyList = (state: RootState) => state.timesheetCertifyUncertify.certifyList;

export const getUncertifyList = (state: RootState) => state.timesheetCertifyUncertify.unCertifyList;

export const getDate = (state: RootState) => state.timesheetCertifyUncertify.date;
