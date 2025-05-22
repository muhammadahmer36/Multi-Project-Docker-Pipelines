import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { SummaryInformation, timeOffActionsButtons } from 'pages/TimeOffCalendar/types';
import { getSelectedActionForManager, getSummaryInformation } from 'pages/TimeOffCalendar/selectors';

const useGetContentForDialogBody = () => {
  const [t] = useTranslation();
  const allTimeOffRequest = useSelector(getSummaryInformation);
  const selectedActionId = useSelector(getSelectedActionForManager);

  const {
    approveEmployeeRequest, denyEmployeeRequest, undoRequest,
  } = timeOffActionsButtons;

  const selectedItemCount = allTimeOffRequest
    .filter((eachItem: SummaryInformation) => eachItem.isSelectedForManagerAction).length >= 2;

  switch (selectedActionId) {
    case approveEmployeeRequest:
      return {
        headerTitle: selectedItemCount ? t('approveTimeOffRequests') : t('approveTimeOffRequest'),
        buttonTitle: t('approve'),
        bodyContent: selectedItemCount ? t('approveTimeOffRequestsContent') : t('approveTimeOffRequestContent'),
      };
    case undoRequest:
      return {
        headerTitle: selectedItemCount ? t('pendingTimeOffRequests') : t('pendingTimeOffRequest'),
        buttonTitle: t('moveToPending'),
        bodyContent: selectedItemCount ? t('pendingTimeOffRequestsContent') : t('pendingTimeOffRequestContent'),
      };
    case denyEmployeeRequest:
      return {
        headerTitle: selectedItemCount ? t('denyTimeOffRequests') : t('denyTimeOffRequest'),
        buttonTitle: t('deny'),
        bodyContent: selectedItemCount ? t('denyTimeOffRequestsContent') : t('denyTimeOffRequestContent'),
      };
    default:
      return {
        headerTitle: '',
        buttonTitle: '',
        bodyContent: '',
      };
  }
};

export default useGetContentForDialogBody;
