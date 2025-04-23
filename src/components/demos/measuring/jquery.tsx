import { Loader2 } from 'lucide-react';
import { useRef } from 'react';

import { useJQuery } from '@utils/jquery';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Demo() {
  const demoRef = useRef<HTMLDivElement>(null);
  const jQueryLoaded = useJQuery();

  const runDomManipulation = () => {
    if (!window.$ || !demoRef.current) {
      return;
    }
    $(demoRef.current).empty();

    $('<h3>').text('DOM Manipulation with jQuery').appendTo(demoRef.current);

    const list = $('<ul>')
      .addClass('list-disc pl-5 mt-2')
      .appendTo(demoRef.current);

    $('<li>').text('Item 1').appendTo(list);
    $('<li>').text('Item 2').appendTo(list);
    $('<li>').text('Item 3').appendTo(list);

    $('<button>')
      .text('Click me')
      .addClass(
        'mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      )
      .on('click', function () {
        $(this).text('Clicked!');
      })
      .appendTo(demoRef.current);
  };

  const runAnimation = () => {
    if (!window.$ || !demoRef.current) {
      return;
    }
    $(demoRef.current).empty();

    $('<div>')
      .text('Animated Box')
      .css({
        width: '100px',
        height: '100px',
        backgroundColor: 'purple',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: '20px',
      })
      .appendTo(demoRef.current)
      .animate({ width: '300px', height: '200px', opacity: 0.5 }, 1000)
      .animate({ width: '100px', height: '100px', opacity: 1 }, 1000);
  };

  const runAjaxRequest = () => {
    if (!window.$ || !demoRef.current) {
      return;
    }
    $(demoRef.current).empty();

    $('<h3>').text('AJAX Request').appendTo(demoRef.current);

    const resultDiv = $('<div>')
      .addClass('mt-4 p-4 border rounded')
      .text('Loading data...')
      .appendTo(demoRef.current);

    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'GET',
      success: (data) => {
        resultDiv.html(`
          <h4 class="font-bold">${data.title}</h4>
          <p class="mt-2">${data.body}</p>
        `);
      },
      error: (_xhr, _status, error) => {
        resultDiv.html(`<p class="text-red-500">Error: ${error}</p>`);
      },
    });
  };

  if (!jQueryLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p>Loading jQuery from CDN...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detecting jQuery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">jQuery Operations</h3>
            <div className="space-y-3">
              <Button
                onClick={runDomManipulation}
                className="w-full justify-start"
              >
                DOM Manipulation
              </Button>
              <Button onClick={runAnimation} className="w-full justify-start">
                Animation
              </Button>
              <Button onClick={runAjaxRequest} className="w-full justify-start">
                AJAX Request
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Click the buttons above to run different jQuery operations. Check
              the "jQuery Logs" tab to see the intercepted function calls.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Result</h3>
            <div
              ref={demoRef}
              className="min-h-[200px] border rounded-md p-4 bg-white"
            >
              <p className="text-gray-400">
                Click a button on the left to run a jQuery operation
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
