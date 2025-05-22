export interface PunchHistoryPayload {
    payload: string
    type: string;
}

export interface PunchHistory {
    type: string;
    time: string;
    source: string;
    date: string;
    day: string;
    status: string;
    location: string;
    isExpanded: boolean;
}

export interface InitialState {
    punchHistoryList: PunchHistory[];
    phunchHistorySearchAbleDays: number;
}

export interface PunchHistoryDetails {
    type: string,
    time: string,
    source: string,
    date: string,
    day: string,
    status: string,
    location: string
    isExpanded: boolean;
}
/* eslint-disable no-unused-vars */
export enum SortableTypes {
    Date = 'date',
    Time = 'time',
    Type = 'type',
}

export enum SortOrderRowsKeys {
    rowOneDescending = 'rowOneDescending',
    rowTwoDescendin = 'rowTwoDescending',
    rowThreeDescending = 'rowThreeDescending'
}

export type SortOrderRows = {
    rowOneDescending: boolean;
    rowTwoDescending: boolean,
    rowThreeDescending: boolean
}

export const maximumPhunchHistoryDaysLimitation = 5000;
