import { SummaryInformation, reviewStatus } from 'pages/TimeOffCalendar/types';

const useDisabledActionButtons = (summaryInformation : SummaryInformation[]) => {
  const { pending, denied, approved } = reviewStatus;
  const anySelected = summaryInformation.some((item) => item.isSelectedForManagerAction);

  if (!anySelected) {
    return {
      disabledApproveButton: true,
      disabledDeniedButton: true,
      disabledUndoButton: true,
    };
  }

  const hasPending = summaryInformation.some((item) => item.reviewStatus_Code === pending && item.isSelectedForManagerAction);
  const hasDenied = summaryInformation.some((item) => item.reviewStatus_Code === denied && item.isSelectedForManagerAction);
  const hasApproved = summaryInformation.some((item) => item.reviewStatus_Code === approved && item.isSelectedForManagerAction);

  let disabledApproveButton = true;
  let disabledDeniedButton = true;
  let disabledUndoButton = true;

  if (hasPending && !hasDenied && !hasApproved) {
    disabledApproveButton = false;
    disabledDeniedButton = false;
  } else if (hasDenied && !hasPending && !hasApproved) {
    disabledUndoButton = false;
  } else if (hasApproved && !hasPending && !hasDenied) {
    disabledUndoButton = true;
    disabledDeniedButton = true;
    disabledUndoButton = true;
  }

  return { disabledApproveButton, disabledDeniedButton, disabledUndoButton };
};

export default useDisabledActionButtons;
