import { FiberProvider } from 'its-fine';
import { useRef } from 'react';

import { CUSTOM_useFiber } from '@utils/fibers';
import logger from '@utils/logger';

import { DevToolsDisclaimer } from '@components/elements/devtools-disclaimer';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

function Children() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { fiber } = CUSTOM_useFiber(targetRef);

  logger.header('[custom] @pmndrs/its-fine');
  console.log(fiber);

  return (
    <Card>
      <CardHeader>
        <CardTitle>[custom] @pmndrs/its-fine</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600" ref={targetRef}>
          Let's move the targetRef around.
        </p>
        <DevToolsDisclaimer />
      </CardContent>
    </Card>
  );
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  return (
    <FiberProvider>
      <Children />
    </FiberProvider>
  );
}
