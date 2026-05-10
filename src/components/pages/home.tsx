import {
    BookOpenIcon,
    CodeIcon,
    LayersIcon,
    MousePointerClickIcon,
    SearchIcon,
} from 'lucide-react';

import { Card, CardContent } from '@components/ui/card';
import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
      <div className="max-w-3xl w-full space-y-6">
        <div className="text-center space-y-2">
          <Typography.h2 className="text-3xl font-bold">
            Welcome! 👋
          </Typography.h2>
          <Typography.subtle>
            Select an example from the sidebar to begin exploring.
          </Typography.subtle>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={<LayersIcon className="h-5 w-5" />}
            title="Scheduling"
            description="Fibers, transitions, and input responsiveness"
          />
          <FeatureCard
            icon={<SearchIcon className="h-5 w-5" />}
            title="Measuring"
            description="Profiling with jQuery, react-scan, and react-grab"
          />
          <FeatureCard
            icon={<MousePointerClickIcon className="h-5 w-5" />}
            title="Measuring (Behavior)"
            description="Rage clicks, dead clicks, random scrolling, and wild mouse"
          />
          <FeatureCard
            icon={<CodeIcon className="h-5 w-5" />}
            title="Compiling"
            description="Codemods with jscodeshift, ast-grep, and ts-morph"
          />
          <FeatureCard
            icon={<BookOpenIcon className="h-5 w-5" />}
            title="Other Techniques"
            description="Windowing, code splitting, and data-oriented design"
          />
        </div>
      </div>
    </div>
  );
}

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5 space-y-2">
        <div className="flex items-center gap-2 text-primary">
          {icon}
          <Typography.small className="font-semibold">{title}</Typography.small>
        </div>
        <Typography.subtle>{description}</Typography.subtle>
      </CardContent>
    </Card>
  );
}
