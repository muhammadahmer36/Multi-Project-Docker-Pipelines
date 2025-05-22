import { RootState } from 'redux/reducer';

export const getAdditionalInformationIn = (state: RootState) => state.additionalInformation.additionalInformationIn;
export const getFunctionId = (state: RootState) => state.additionalInformation.functionId;
export const getAdditionalInformationOut = (state: RootState) => state.additionalInformation.additionalInformationOut;
export const getAdditionalInformationTransfer = (state: RootState) => state.additionalInformation.additionalInformationTransfer;
export const getTimePunchId = (state: RootState) => state.additionalInformation.timePunchId;
export const getLoaderState = (state: RootState) => state.additionalInformation.showLoader;
export const getOpenAdditionalDataForm = (state: RootState) => state.additionalInformation.openAdditionalInformationForm;
export const shouldNavigateToDashboard = (state: RootState) => state.additionalInformation.navigateToDashboard;
export const getAdditionalDataForm = (state: RootState) => state.additionalInformation.openAdditionalInformationForm;
export const disableHeader = (state: RootState) => state.additionalInformation.disableHeader;
export const getUniqueId = (state: RootState) => state.common.uniqueId;

export default null;
