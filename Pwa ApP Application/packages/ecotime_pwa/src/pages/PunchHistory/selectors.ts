import { RootState } from 'redux/reducer';

export const getPunchHistory = (state: RootState) => state.punchHistory.punchHistoryList;

export const getPunchHistorySearchDaysRestriction = (state: RootState) => state.punchHistory.phunchHistorySearchAbleDays;
