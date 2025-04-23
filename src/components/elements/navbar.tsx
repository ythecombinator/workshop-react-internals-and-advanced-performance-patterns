import { ZapIcon } from 'lucide-react';

import Typography from '@components/ui/typography';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function NavigationBar() {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center text-[#00d8ff]">
              <ZapIcon className="h-8 w-8" />
              <Typography.h1 className="ml-2 text-xl font-bold">
                React: Internals & Advanced Performance Patterns
              </Typography.h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
