/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
import { eventChannel } from 'redux-saga';
import {
  Effect,
  all,
  call,
  delay,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects';
import {
  getBackgroundTime,
  getRunningClock,
  getRunningClockDBServerGMT,
} from './selectors';
import {
  setBackgroundTime, setAppBackgroundDuration, setRunningClock, setRunningClockDBServerGMT,
} from './slice';

function createVisibilityChangeEventChannel() {
  return eventChannel((emit) => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        emit('visible');
      } else {
        emit('hidden');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
}

export function* watchAppVisibility(): Generator<Effect, void, any> {
  const visibilityChannel = yield call(createVisibilityChangeEventChannel);

  try {
    while (true) {
      const visibility = yield take(visibilityChannel);

      if (visibility === 'visible') {
        const backgroundTime = yield select(getBackgroundTime);

        if (backgroundTime) {
          const currentTime = Date.now();
          const appTimeInBackground = currentTime - backgroundTime;

          yield all([
            put(setAppBackgroundDuration(appTimeInBackground)),
            put(setBackgroundTime(null)),
          ]);

          const { runningClock, runningClockDBServerGMT } = yield all({
            runningClock: select(getRunningClock),
            runningClockDBServerGMT: select(getRunningClockDBServerGMT),
          });

          const runningClockUpdated = runningClock + appTimeInBackground;
          const runningClockDBServerGMTUpdated = runningClockDBServerGMT + appTimeInBackground;

          yield all([
            put(setRunningClock(runningClockUpdated)),
            put(setRunningClockDBServerGMT(runningClockDBServerGMTUpdated)),
          ]);
        }
      } else {
        yield all([
          put(setBackgroundTime(Date.now())),
          put(setAppBackgroundDuration(0)),
        ]);
      }
    }
  } finally {
    visibilityChannel.close();
  }
}

function* runningClock(): Generator<Effect, void, any> {
  const milliSecond = 1000;

  while (true) {
    try {
      const { backgroundTime, runningClock, runningClockDBServerGMT } = yield all({
        backgroundTime: select(getBackgroundTime),
        runningClock: select(getRunningClock),
        runningClockDBServerGMT: select(getRunningClockDBServerGMT),
      });

      if (backgroundTime === null && runningClock !== null && runningClockDBServerGMT !== null) {
        const runningClockUpdated = runningClock + milliSecond;
        const runningClockDBServerGMTUpdated = runningClockDBServerGMT + milliSecond;

        yield all([
          put(setRunningClock(runningClockUpdated)),
          put(setRunningClockDBServerGMT(runningClockDBServerGMTUpdated)),
        ]);
      }

      yield delay(milliSecond);
    } catch (error) {
      // will integrating Sentry or logging the error.
    }
  }
}

export default function* rootSaga(): Generator<Effect, void, any> {
  yield all([
    fork(watchAppVisibility),
    fork(runningClock),
  ]);
}
