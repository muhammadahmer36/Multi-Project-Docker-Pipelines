import { PayloadAction } from '@reduxjs/toolkit';
import { Nullable } from 'types/common';
import { IPunchAdditionalInfo } from 'pages/AdditionalData/types';
import { Dashboard, DateTimeFormats } from '../types';

/* eslint-disable no-unused-vars */
export type TimeIn = {
    type: string;
}

export type TimeInSuccess = {
    type: string;
    payload: string;
}

export enum TimePunch {
    TimeIn = 1,
    TimeOut = 2,
    Transfer = 3,
}

export interface SetTransferActionPayload {
    timeIn: string;
    timeOut: string;
}
export interface TimePunchActionPayload {
    time: string;
    punch: TimePunch;
    uniqueId?: string;
    isOfflinePunch?: boolean;
    dbServerGMT: string,
}

export interface ClockWidgetItem {
    profileId: number;
    functionId: number;
    dataElementId: number;
    getAdditionalData: boolean;
    functionName: string;
    entryCode: string;
    imageName: string;
    description: string;
    functionNextExpected: boolean;
    functionButton_Color: string;
    functionButton_Align: string;
    displayOrder: number;
    controllerName: string;
    dbServerGMT: string;
}

export interface InitialState {
    showLoader: boolean;
    timeIn: Nullable<ClockWidgetItem>;
    timeOut: Nullable<ClockWidgetItem>;
    transfer: Nullable<ClockWidgetItem>;
    currentPunch: Nullable<TimePunch>;
    nextPunch: Nullable<TimePunch>;
    lastPunch: string;
    dateTimeUTC: string;
    clockComponentItems: ClockWidgetItem[]
}

export interface ClockWidgetResponse {
    clockWidgetItems: ClockWidgetItem[];
    lastPunch: string;
    dateTimeFormats: DateTimeFormats;
    utcDateTime: string;
    punchAdditionalInfo: IPunchAdditionalInfo;
    dashboard: Dashboard;
}

export interface MakePunchPayload {
    functionId: number;
    timestamp: string;
    isOfflinePunch?: boolean;
    timeZoneOffset: number;
    clientGuidId?: string;
    geoLocation: string;
    UtcTimestamp: string;
    source: string;
}
export interface PayloadActionTimePunch extends PayloadAction<TimePunchActionPayload> {
    timeStamp: number
}

export enum PunchType {
    PunchIn = 'In',
    PunchOut = 'Out',
    PunchTransfer = 'Transfer'
}
