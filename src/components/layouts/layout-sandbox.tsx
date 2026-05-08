import type React from 'react';

import { BehaviorEvent } from '@utils/user-behavior';

import EventLog from '@components/elements/event-log';
import SandboxControls from '@components/elements/sandbox-controls';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface SandboxLayoutProps extends React.PropsWithChildren {
  title: string;
  description: string;
  events: BehaviorEvent[];
  isTracking: boolean;
  onToggleTracking: () => void;
  onClearEvents: () => void;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function SandboxLayout({
  title,
  description,
  events,
  isTracking,
  onToggleTracking,
  onClearEvents,
  children,
}: SandboxLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="mb-6 text-gray-700">{description}</p>

      <SandboxControls
        isTracking={isTracking}
        onToggleTracking={onToggleTracking}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
        <EventLog
          events={events}
          isTracking={isTracking}
          onClear={onClearEvents}
        />
      </div>
    </div>
  );
}
