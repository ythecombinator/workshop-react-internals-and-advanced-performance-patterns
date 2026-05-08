import { Button } from '@components/ui/button';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface SandboxControlsProps {
  isTracking: boolean;
  onToggleTracking: () => void;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function SandboxControls({
  isTracking,
  onToggleTracking,
}: SandboxControlsProps) {
  return (
    <div className="mb-6">
      <Button
        onClick={onToggleTracking}
        className={`px-4 py-2 rounded-md ${
          isTracking
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </Button>
      <p className="mt-2 text-sm text-gray-500">
        {isTracking
          ? 'Tracking is active. Try the behavior described below.'
          : 'Click to start tracking user behavior.'}
      </p>
    </div>
  );
}
