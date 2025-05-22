import { ListItem } from 'components/DropDown/types';
import { SelectedItem } from '../types';

export const shouldDisabledSearchButton = (
  selectedReviewStatus: string[],
  selectedTimesheetGroup: ListItem,
  selectedEmployeeList: ListItem[],
) => {
  const { noneIsSelected } = SelectedItem;
  return selectedReviewStatus.length === noneIsSelected
        || (selectedTimesheetGroup === null && selectedEmployeeList.length === noneIsSelected);
};
