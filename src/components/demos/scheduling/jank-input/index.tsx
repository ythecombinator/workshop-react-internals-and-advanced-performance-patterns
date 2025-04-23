import { useState } from 'react';

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
        <CardTitle>Jank Input: Before</CardTitle>
      </CardHeader>
      <CardContent>
        <ResourcefulComponent value={value} />
        <Input
          value={value}
          onChange={(ev) => setValue(Number(ev.target.value))}
          type="number"
        />
      </CardContent>
    </Card>
  );
}
