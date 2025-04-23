import { useState } from 'react';

import { Button } from '@components/ui/button';

export default function HeavyComponent2() {
  const [items, setItems] = useState<string[]>([]);

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Component 2</h3>
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          ~7KB bundle
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-md">
        <p className="mb-2">This is another lazy-loaded component!</p>
        <div className="flex items-center gap-2 mb-4">
          <Button size="sm" onClick={addItem} variant="outline">
            Add Item
          </Button>
        </div>

        {items.length > 0 && (
          <ul className="space-y-1 text-sm">
            {items.map((item, index) => (
              <li key={index} className="p-2 bg-white rounded border">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
