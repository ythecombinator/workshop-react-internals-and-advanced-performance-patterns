import { Suspense, useState } from 'react';

import { Loading } from '@components/elements/loading';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';

import ResourcefulComponent from './ResourcefulComponent';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [value, setValue] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jank Input: After</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={<Loading message="Performing CPU-bound operation" />}
        >
          <ResourcefulComponent value={value} />
        </Suspense>
        <Input
          value={value}
          onChange={(ev) => setValue(Number(ev.target.value))}
          type="number"
        />
      </CardContent>
    </Card>
  );
}
