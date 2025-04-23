import { useNavigate } from 'react-router-dom';

import { Button } from '@components/ui/button';

//  ---------------------------------------------------------------------------
//  UTILS
//  ---------------------------------------------------------------------------

const hashLinks = [
  {
    name: 'Example 1',
    url: 'example-1',
  },
  {
    name: 'Example 2',
    url: 'example-2',
  },
  {
    name: 'Example 3',
    url: 'example-3',
  },
  {
    name: 'Example 4',
    url: 'example-4',
  },
  {
    name: 'Example 5',
    url: 'example-5',
  },
  {
    name: 'Example 6',
    url: 'example-6',
  },
];

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function HashNavigation() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {hashLinks.map((hash) => (
        <Button
          key={hash.url}
          variant="outline"
          className="h-auto py-3 px-4 text-left justify-start hover:bg-gray-100 transition-colors"
          onClick={() => {
            navigate(`#${hash.url}`);
          }}
        >
          {hash.name}
        </Button>
      ))}
    </div>
  );
}
