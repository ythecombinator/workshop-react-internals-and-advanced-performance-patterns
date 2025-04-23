import { useState } from 'react';

import { Button } from '@components/ui/button';

export default function HeavyComponent3() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Component 3</h3>
        <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
          ~6KB bundle
        </div>
      </div>

      <div className="p-4 bg-purple-50 rounded-md">
        <p className="mb-2">This is a third lazy-loaded component!</p>
        <Button
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          variant="secondary"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>

        {showDetails && (
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-sm">
              This content is only rendered when you click the button.
              Similarly, this entire component was only loaded when you
              explicitly requested it!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
