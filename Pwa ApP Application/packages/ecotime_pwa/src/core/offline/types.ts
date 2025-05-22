/* eslint-disable @typescript-eslint/no-explicit-any */
import { take } from 'redux-saga/effects';

export type OfflineQueueItem = any

export interface SetNetWorkSatus {
  type: string;
  payload: boolean,
}

export interface ProcessQueue {
  type: string;
}

export interface OfflineQueueState {
    offlineQueue: OfflineQueueItem[];
  }

export interface processingQueueState {
    online: boolean;
    processingQueue: boolean,
}

export interface RaceResult {
    online: boolean;
    cancel: ReturnType<typeof take>;
  }

export interface Action {
    type: string;
    payload: any
    timeStamp: string;
  }

export interface Configuration {
  persistedActions: string[]
}

export interface SetOfflineAction {
  payload: boolean;
  type: 'offlineQueue/setOffline';
}

export type EnqueuePayload = any;
