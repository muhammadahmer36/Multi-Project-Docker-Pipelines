import { useSelector } from 'react-redux';
import { convertTimestampToISO } from 'core/utils';
import { getRunningClock } from '../selectors';

export default function useRunningClock() {
  const runningClockTimeStamp = useSelector(getRunningClock);
  const runningClockDateTimeUTC = convertTimestampToISO(runningClockTimeStamp);
  return runningClockDateTimeUTC;
}
