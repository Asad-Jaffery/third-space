'use client';

import { Suspense } from 'react';
import SpaceDetails from '../spaces/SpaceDetails';

export default function SpaceDetailsAliasRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpaceDetails />
    </Suspense>
  );
}
