import { useEffect, useState, useTransition } from 'react';

import Dashboard from './dashboard';
import { Data, data as initialData } from './data';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [data, setData] = useState(initialData);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setData(initialData);
  }, []);

  const onChange = (newData: Data) => {
    startTransition(() => {
      setData(newData);
    });
  };

  return (
    <Dashboard data={data} initialData={initialData} onChange={onChange} />
  );
}
