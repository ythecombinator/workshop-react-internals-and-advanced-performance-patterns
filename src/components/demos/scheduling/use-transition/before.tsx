import { useEffect, useState } from 'react';

import Dashboard from './dashboard';
import { Data, data as initialData } from './data';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, []);

  const onChange = (newData: Data) => {
    setData(newData);
  };

  return (
    <Dashboard data={data} initialData={initialData} onChange={onChange} />
  );
}
