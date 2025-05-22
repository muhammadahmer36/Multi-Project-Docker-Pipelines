import React, { RefObject } from 'react';
import List from './List';

interface Props {
  listContainerRef: RefObject<HTMLDivElement>
}

export default function TimesheetList(props: Props) {
  const { listContainerRef } = props;
  return (
    <List listContainerRef={listContainerRef} />
  );
}
