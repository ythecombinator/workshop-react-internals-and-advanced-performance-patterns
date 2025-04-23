import { metadata } from '@utils/theme';

import { Card, CardContent } from '@components/ui/card';
import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Card className="max-w-2xl w-full bg-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <Typography.h2 className="text-3xl font-bold text-gray-800">
              Hello, {metadata.name}! 👋
            </Typography.h2>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-left">
              <Typography.p className="text-gray-600 mb-4">
                Select an example from the sidebar to begin exploring.
              </Typography.p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Browse different categories in the sidebar</li>
                <li>Click on a category to expand it</li>
                <li>Select an example to view its content</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
