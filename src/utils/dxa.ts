//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface RageClickOptions {
  threshold?: number;
  timeWindow?: number;
  maxDistance?: number;
  onRageClick?: (
    event: MouseEvent,
    clickCount: number,
    clickPositions: Array<{ x: number; y: number }>
  ) => void;
}

export interface RageClickTracker {
  cleanup: () => void;
  getClickCount: () => number;
  reset: () => void;
}

//  ---------------------------------------------------------------------------
//  CORE
//  ---------------------------------------------------------------------------

export function trackRageClicks(
  element: HTMLElement,
  options?: RageClickOptions
): RageClickTracker {
  const {
    threshold = 3,
    timeWindow = 500,
    maxDistance = 30,
    onRageClick = () => {},
  } = options || {};

  let clickCount = 0;
  let clickTimer: number | null = null;
  let clickPositions: Array<{ x: number; y: number }> = [];

  const handleClick = (event: MouseEvent) => {
    // Record click position
    const position = { x: event.clientX, y: event.clientY };
    clickPositions.push(position);

    // Check if click is in the same area as previous clicks
    const isInSameArea =
      clickPositions.length < 2 ||
      clickPositions.every(
        (pos) =>
          Math.sqrt(
            Math.pow(pos.x - position.x, 2) + Math.pow(pos.y - position.y, 2)
          ) <= maxDistance
      );

    if (!isInSameArea) {
      // Reset if clicked in a different area
      reset();
      clickPositions = [position];
      return;
    }

    // Increment click counter
    clickCount++;

    // Clear existing timer
    if (clickTimer) {
      window.clearTimeout(clickTimer);
    }

    // Set timer to reset counter after timeWindow
    clickTimer = window.setTimeout(() => {
      reset();
    }, timeWindow);

    // Check if rage clicking threshold is met
    if (clickCount >= threshold) {
      onRageClick(event, clickCount, [...clickPositions]);
    }
  };

  // Reset click counter and positions
  const reset = () => {
    clickCount = 0;
    clickPositions = [];
    if (clickTimer) {
      window.clearTimeout(clickTimer);
      clickTimer = null;
    }
  };

  // Attach event listener
  element.addEventListener('click', handleClick);

  // Return methods to manage the tracker
  return {
    cleanup: () => {
      element.removeEventListener('click', handleClick);
      if (clickTimer) {
        window.clearTimeout(clickTimer);
      }
    },
    getClickCount: () => clickCount,
    reset,
  };
}
