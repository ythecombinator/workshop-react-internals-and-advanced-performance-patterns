import { BehaviorEvent } from '@utils/user-behavior';

import { Button } from '@components/ui/button';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface EventLogProps {
  events: BehaviorEvent[];
  isTracking: boolean;
  onClear: () => void;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function EventLog({
  events,
  isTracking,
  onClear,
}: EventLogProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Detected Events</h2>
        <Button
          onClick={onClear}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
        >
          Clear
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">
          No events detected yet. {!isTracking && '(Tracking is paused)'}
        </p>
      ) : (
        <div className="space-y-3 max-h-100 overflow-y-auto">
          {events.map((event, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
              <div className="font-medium">{event.type}</div>
              <div className="text-sm text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
