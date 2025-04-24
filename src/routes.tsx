import { createBrowserRouter } from 'react-router-dom';

import DemoJquery from '@components/demos/measuring/jquery';
import DemoRageClicks from '@components/demos/measuring/rage-clicks';
import DemoCodeSplitting from '@components/demos/other/code-splitting';
import DemoWindowing from '@components/demos/other/windowing';
import DemoFibersCustom from '@components/demos/scheduling/fibers/custom';
import DemoFibersItsFine from '@components/demos/scheduling/fibers/its-fine';
import DemoJankInputBefore from '@components/demos/scheduling/jank-input';
import DemoJankInputWithScheduler from '@components/demos/scheduling/jank-input-scheduler';
import DemoBlockMainThread from '@components/demos/scheduling/long-tasks';
import DemoSuspendReact from '@components/demos/scheduling/suspend-react';
import DemoUseRouterSelectorAfter from '@components/demos/scheduling/use-router-selector/after';
import DemoUseRouterSelectorBefore from '@components/demos/scheduling/use-router-selector/before';

import HomePage from '@components/pages/home';
import NotFoundPage from '@components/pages/not-found';

import RootLayout from '@components/layouts/layout-root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'scheduling',
        children: [
          {
            path: 'custom',
            element: <DemoFibersCustom />,
          },
          {
            path: 'its-fine',
            element: <DemoFibersItsFine />,
          },
          {
            path: 'long-tasks',
            element: <DemoBlockMainThread />,
          },
          {
            path: 'suspend-react',
            element: <DemoSuspendReact />,
          },
          {
            path: 'jank-input/before',
            element: <DemoJankInputBefore />,
          },
          {
            path: 'jank-input/after',
            element: <DemoJankInputWithScheduler />,
          },
          {
            path: 'use-history-selector/before',
            element: <DemoUseRouterSelectorBefore />,
          },
          {
            path: 'use-history-selector/after',
            element: <DemoUseRouterSelectorAfter />,
          }
        ],
      },
      {
        path: 'measuring',
        children: [
          {
            path: 'jquery',
            element: <DemoJquery />,
          },
          {
            path: 'rage-clicking',
            element: <DemoRageClicks />,
          },
        ],
      },
      {
        path: 'other',
        children: [
          {
            path: 'windowing',
            element: <DemoWindowing />,
          },
          {
            path: 'code-splitting',
            element: <DemoCodeSplitting />,
          },
        ],
      },
    ],
  },
]);
