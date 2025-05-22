import { useSelector } from 'react-redux';
import { convertTimestampToISO } from 'core/utils';
import { getRunningClockDBServerGMT } from '../selectors';

export default function useRunningClockDBServer() {
  const runningClockDBServerGMTTimeStamp = useSelector(getRunningClockDBServerGMT);
  const runningClockDBServerGMTTimeUTC = convertTimestampToISO(runningClockDBServerGMTTimeStamp);
  return runningClockDBServerGMTTimeUTC;
}
