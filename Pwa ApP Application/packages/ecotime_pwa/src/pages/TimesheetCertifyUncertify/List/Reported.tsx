import React, { RefObject } from 'react';
import List from './List';
import { CertifyItem } from '../types';

interface Props {
  listContainerRef: RefObject<HTMLDivElement>
  data: CertifyItem[]
}

export default function Reported(props: Props) {
  const { listContainerRef, data } = props;
  return (
    <List listContainerRef={listContainerRef} data={data} />
  );
}
