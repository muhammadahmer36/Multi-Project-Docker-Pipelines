import React, { Suspense } from 'react';
import { CompInterface } from 'types/componentInterface';

function LazyLoadWrapper({ children }: CompInterface) {
  return (
    <Suspense fallback={<div />}>
      {children}
    </Suspense>
  );
}

export default LazyLoadWrapper;
