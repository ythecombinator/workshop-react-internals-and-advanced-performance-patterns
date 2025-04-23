import { Suspense } from 'react';

import { CUSTOM_suspend, delay } from '@utils/scheduling';

import { Loading } from '@components/elements/loading';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

export const Hello = () => {
  const value = CUSTOM_suspend(() => delay('Loaded after 3000 ms', 3000));
  return <Typography.h3>{value}</Typography.h3>;
};

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>@pmndrs/suspend-react</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Loading message="Loading suspended data..." />}>
          <Hello />
        </Suspense>
      </CardContent>
    </Card>
  );
}
