//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export function DevToolsDisclaimer() {
  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center m-6">
      <div className="flex flex-col items-center justify-center space-y-3">
        <h3 className="text-lg font-medium text-gray-900">
          This exercise is meant to be inspected in dev tools
        </h3>
        <p className="mb-2">
          Open your browser's developer tools to see the console output!
        </p>
      </div>
    </div>
  );
}
