import { Clock, FileCode, Loader2, Package } from 'lucide-react';
import React, { Suspense, lazy, useState } from 'react';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';

//  ---------------------------------------------------------------------------
//  UI: HELPERS
//  ---------------------------------------------------------------------------

const HeavyComponent1 = lazy(() => import('./heavy-component-1'));
const HeavyComponent2 = lazy(() => import('./heavy-component-2'));
const HeavyComponent3 = lazy(() => import('./heavy-component-3'));

const HeavyComponentWithDelay = lazy(
  () =>
    new Promise<{ default: React.ComponentType<any> }>((resolve) => {
      // Simulate a network delay of 2 seconds
      setTimeout(() => {
        resolve(import('./heavy-component-1'));
      }, 2000);
    })
);

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
    <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
    <p className="text-gray-500">Loading component...</p>
  </div>
);

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const [loadedComponents, setLoadedComponents] = useState<string[]>([]);

  const handleLoadComponent = (componentName: string) => {
    if (!loadedComponents.includes(componentName)) {
      setLoadedComponents([...loadedComponents, componentName]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Splitting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Components</CardTitle>
              <CardDescription>
                Click to load components on demand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => handleLoadComponent('component1')}
                    disabled={loadedComponents.includes('component1')}
                    className="justify-start"
                  >
                    <FileCode className="mr-2 h-4 w-4" />
                    Load Component 1
                    {loadedComponents.includes('component1') && (
                      <Badge variant="outline" className="ml-auto">
                        Loaded
                      </Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleLoadComponent('component2')}
                    disabled={loadedComponents.includes('component2')}
                    className="justify-start"
                  >
                    <FileCode className="mr-2 h-4 w-4" />
                    Load Component 2
                    {loadedComponents.includes('component2') && (
                      <Badge variant="outline" className="ml-auto">
                        Loaded
                      </Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleLoadComponent('component3')}
                    disabled={loadedComponents.includes('component3')}
                    className="justify-start"
                  >
                    <FileCode className="mr-2 h-4 w-4" />
                    Load Component 3
                    {loadedComponents.includes('component3') && (
                      <Badge variant="outline" className="ml-auto">
                        Loaded
                      </Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleLoadComponent('delayed')}
                    disabled={loadedComponents.includes('delayed')}
                    variant="secondary"
                    className="justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Load With Delay (2s)
                    {loadedComponents.includes('delayed') && (
                      <Badge variant="outline" className="ml-auto">
                        Loaded
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Component Display Area</CardTitle>
              <CardDescription>
                Components will appear here when loaded
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] border rounded-md p-0 overflow-hidden">
              {loadedComponents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                  <Package className="h-12 w-12 mb-4" />
                  <p>No components loaded yet</p>
                  <p className="text-sm mt-2">
                    Click the buttons on the left to load components
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {loadedComponents.includes('component1') && (
                    <div className="p-4">
                      <Suspense fallback={<LoadingFallback />}>
                        <HeavyComponent1 />
                      </Suspense>
                    </div>
                  )}

                  {loadedComponents.includes('component2') && (
                    <div className="p-4">
                      <Suspense fallback={<LoadingFallback />}>
                        <HeavyComponent2 />
                      </Suspense>
                    </div>
                  )}

                  {loadedComponents.includes('component3') && (
                    <div className="p-4">
                      <Suspense fallback={<LoadingFallback />}>
                        <HeavyComponent3 />
                      </Suspense>
                    </div>
                  )}

                  {loadedComponents.includes('delayed') && (
                    <div className="p-4">
                      <Suspense fallback={<LoadingFallback />}>
                        <HeavyComponentWithDelay />
                      </Suspense>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
