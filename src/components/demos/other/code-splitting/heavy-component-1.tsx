import { useState } from 'react';

import { Button } from '@components/ui/button';

export default function HeavyComponent1() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Component 1</h3>
        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          ~5KB bundle
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-md">
        <p className="mb-2">This component was loaded on demand!</p>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setCount(count + 1)}>
            Count: {count}
          </Button>
          <span className="text-sm text-gray-500">Try clicking the button</span>
        </div>
      </div>
    </div>
  );
}
