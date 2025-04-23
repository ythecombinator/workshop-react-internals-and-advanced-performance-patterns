import { FiberProvider, useFiber } from 'its-fine';

import logger from '@utils/logger';

import { DevToolsDisclaimer } from '@components/elements/devtools-disclaimer';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

function Children() {
  const fiber = useFiber();

  if (!fiber) {
    return null;
  }

  logger.header('@pmndrs/its-fine');
  console.log(fiber);

  return (
    <Card>
      <CardHeader>
        <CardTitle>@pmndrs/its-fine</CardTitle>
      </CardHeader>
      <CardContent>
        <DevToolsDisclaimer />
      </CardContent>
    </Card>
  );
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Page() {
  return (
    <FiberProvider>
      <Children />
    </FiberProvider>
  );
}
