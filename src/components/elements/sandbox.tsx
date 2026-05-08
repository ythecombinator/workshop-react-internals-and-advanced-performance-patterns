import type React from 'react';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface SandboxProps extends React.PropsWithChildren {
  title: string;
  description: string;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Sandbox({
  title,
  description,
  children,
}: SandboxProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {children}
    </div>
  );
}
