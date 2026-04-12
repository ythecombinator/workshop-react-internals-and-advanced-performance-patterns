import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export function DevToolsDisclaimer() {
  return (
    <div className="p-6 border-2 border-dashed border-border rounded-lg bg-muted/50 text-center m-6">
      <div className="flex flex-col items-center justify-center space-y-2">
        <Typography.h3 className="mt-0">
          This exercise is meant to be inspected in dev tools
        </Typography.h3>
        <Typography.subtle>
          Open your browser's developer tools to see the console output!
        </Typography.subtle>
      </div>
    </div>
  );
}
