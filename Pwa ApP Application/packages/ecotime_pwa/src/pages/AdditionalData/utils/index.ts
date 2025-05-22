import { IPunchDetail } from '../types';

const checkRequiredFieldsToDisableHeader = (punchDetails: IPunchDetail[]) => {
  let isHeaderDisabled = false;
  if (Array.isArray(punchDetails)) {
    isHeaderDisabled = punchDetails.some((detail) => detail.fieldRequired === true);
  }
  return isHeaderDisabled;
};

export default checkRequiredFieldsToDisableHeader;
