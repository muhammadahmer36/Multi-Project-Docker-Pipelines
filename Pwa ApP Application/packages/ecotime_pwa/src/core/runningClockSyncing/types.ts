import { Nullable } from 'types/common';

export interface BackgroundTimeSyncing {
    backgroundTime: Nullable<number>,
    appBackgroundDuration: Nullable<number>,
    runningClock: Nullable<number>,
    runningClockDBServerGMT: Nullable<number>,
}
