import { RootState } from 'redux/reducer';

export const getBalanceCategories = (state: RootState) => state.Category.balanceCategory;
export const getBalanceDetail = (state: RootState) => state.Category.balanceGroupDetails;
export const getHeaderInfo = (state: RootState) => state.Category.headerInfo;
