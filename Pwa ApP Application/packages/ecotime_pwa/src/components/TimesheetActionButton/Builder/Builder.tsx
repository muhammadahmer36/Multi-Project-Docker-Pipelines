import { TimesheetActions } from 'pages/dashboard/types';
import Certify from '../Certify';
import Calculate from '../Calculate';
import Notes from '../Notes';

interface Props {
  actionId: number;
}
export default function Builder({ actionId }: Props) {
  switch (actionId) {
    case TimesheetActions.Certitfy:
    case TimesheetActions.UnCertitfy:
      return <Certify />;
    case TimesheetActions.Notes:
      return <Notes />;
    case TimesheetActions.Calculate:
      return <Calculate />;
    default:
      return null;
  }
}
