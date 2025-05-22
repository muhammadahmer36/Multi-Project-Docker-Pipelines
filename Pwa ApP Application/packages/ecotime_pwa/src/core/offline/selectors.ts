import { RootState } from 'redux/reducer';

export const getOnline = (state: RootState) => state.processingQueue.online;
export const getOffline = (state: RootState) => !state.processingQueue.online;
export const getOfflineQueue = (state: RootState) => state.offlineQueue.offlineQueue;
export const getProcessingQueue = (state: RootState) => state.processingQueue.processingQueue;
