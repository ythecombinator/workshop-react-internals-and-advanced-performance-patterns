import { useSyncExternalStore } from 'react';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface RouterLocation {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

interface RouterState {
  location: RouterLocation;
}

type RouterSelector<T> = (state: RouterState) => T;

//  ---------------------------------------------------------------------------
//  CORE
//  ---------------------------------------------------------------------------

export function useHistorySelector<T>(selector: RouterSelector<T>): T {
  // Get the current router state (location)
  const getSnapshot = () => {
    const location = window.location;
    const state = history.state || {};

    // Create a router state object similar to what the selector expects
    const routerState: RouterState = {
      location: {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: state,
        key: state.key || 'default',
      },
    };

    return selector(routerState);
  };

  // Subscribe to location changes
  const subscribe = (callback: () => void) => {
    window.addEventListener('popstate', callback);

    // Also listen for programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (
      ...args: Parameters<typeof originalPushState>
    ) {
      originalPushState.apply(this, args);
      callback();
    };

    history.replaceState = function (
      ...args: Parameters<typeof originalReplaceState>
    ) {
      originalReplaceState.apply(this, args);
      callback();
    };

    return () => {
      window.removeEventListener('popstate', callback);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  };

  // Use useSyncExternalStore to subscribe to router state changes
  // and only re-render when the selected value changes
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
