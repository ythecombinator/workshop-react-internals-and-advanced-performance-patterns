import { useEffect, useState } from 'react';
import type { Fiber } from 'react-reconciler';

import { metadata } from '@utils/theme';

//  ---------------------------------------------------------------------------
//  CORE
//  ---------------------------------------------------------------------------

export function CUSTOM_useFiber(elementRef: React.RefObject<HTMLElement>) {
  const [fiber, setFiberInfo] = useState<Fiber | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    try {
      const fiber = getFiberFromDOM(elementRef.current);

      if (fiber) {
        setFiberInfo(fiber);
        highlightFiber(fiber);
      } else {
        setError(
          'Could not access Fiber node. This is expected in production builds.'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
    }
  }, [elementRef]);

  return { fiber, error };
}

//  ---------------------------------------------------------------------------
//  HELPERS
//  ---------------------------------------------------------------------------

function getFiberFromDOM(element: HTMLElement) {
  const key = Object.keys(element).find(
    (key) =>
      key.startsWith('__reactFiber$') ||
      key.startsWith('__reactInternalInstance$')
  );

  if (key) {
    return (element as any)[key] as Fiber;
  } else {
    return null;
  }
}

export function highlightFiber(fiber: Fiber) {
  if (!(fiber.stateNode instanceof HTMLElement)) {
    return;
  }

  const rect = fiber.stateNode.getBoundingClientRect();
  const highlight = document.createElement('div');

  highlight.style.border = `5px solid ${metadata.primaryColor}`;
  highlight.style.position = 'fixed';
  highlight.style.top = `${rect.top}px`;
  highlight.style.left = `${rect.left}px`;
  highlight.style.width = `${rect.width}px`;
  highlight.style.height = `${rect.height}px`;
  highlight.style.zIndex = '999999999';

  document.documentElement.appendChild(highlight);

  setTimeout(() => {
    document.documentElement.removeChild(highlight);
  }, 1000);
}
