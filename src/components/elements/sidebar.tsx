import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface Example {
  id: string;
  title: string;
  path: string;
}

interface Section {
  id: string;
  title: string;
  examples: Example[];
}

//  ---------------------------------------------------------------------------
//  UTILS
//  ---------------------------------------------------------------------------

export const sections: Section[] = [
  {
    id: 'scheduling',
    title: 'Scheduling',
    examples: [
      {
        id: 'scheduling/long-tasks',
        title: 'Long Tasks',
        path: '/scheduling/long-tasks',
      },
      {
        id: 'scheduling/its-fine',
        title: '@pmndrs/its-fine',
        path: '/scheduling/its-fine',
      },
      {
        id: 'scheduling/custom',
        title: '[custom] @pmndrs/its-fine',
        path: '/scheduling/custom',
      },
      {
        id: 'scheduling/suspend-react',
        title: '[custom] @pmndrs/suspend-react',
        path: '/scheduling/suspend-react',
      },
      {
        id: 'use-history-selector/before',
        title: '[before] useHistorySelector',
        path: '/scheduling/use-history-selector/before',
      },
      {
        id: 'use-history-selector/after',
        title: '[after] useHistorySelector',
        path: '/scheduling/use-history-selector/after',
      },
      {
        id: 'use-transition/before',
        title: '[before] useTransition',
        path: '/scheduling/use-transition/before',
      },
      {
        id: 'use-transition/after',
        title: '[after] useTransition',
        path: '/scheduling/use-transition/after',
      },
      {
        id: 'jank-input/before',
        title: '[before] Jank Input',
        path: '/scheduling/jank-input/before',
      },
      {
        id: 'jank-input/after',
        title: '[after] Jank Input',
        path: '/scheduling/jank-input/after',
      },
    ],
  },
  {
    id: 'measuring',
    title: 'Measuring',
    examples: [
      {
        id: 'jquery',
        title: 'jQuery',
        path: '/measuring/jquery',
      },
      {
        id: 'rage-clicking',
        title: 'Rage Clicking',
        path: '/measuring/rage-clicking',
      },
    ],
  },
  {
    id: 'other',
    title: 'Other Techniques',
    examples: [
      {
        id: 'windowing',
        title: 'Windowing',
        path: '/other/windowing',
      },
      {
        id: 'code-splitting',
        title: 'Code Splitting',
        path: '/other/code-splitting',
      },
    ],
  },
];

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function Sidebar() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const isExampleActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isSectionActive = (section: Section) => {
    return section.examples.some((example) => isExampleActive(example.path));
  };

  for (const section of sections) {
    if (isSectionActive(section) && !expandedSections[section.id]) {
      expandedSections[section.id] = true;
    }
  }

  return (
    <div className="w-80 bg-white p-4 border-r border-gray-200 h-full overflow-y-auto hidden md:block">
      <div className="space-y-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Categories
        </div>
        <nav className="space-y-1">
          {sections.map((section) => {
            const isActive = isSectionActive(section);
            const isExpanded = expandedSections[section.id] || isActive;

            return (
              <div key={section.id} className="space-y-1">
                <div
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                  <span className="truncate">{section.title}</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                    {section.examples.length}
                  </span>
                </div>

                {isExpanded && section.examples.length > 0 && (
                  <div className="ml-6 space-y-1 mt-1">
                    {section.examples.map((example) => (
                      <Link
                        key={example.id}
                        to={example.path}
                        className={`block px-3 py-1.5 text-sm rounded-md ${
                          isExampleActive(example.path)
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {example.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
