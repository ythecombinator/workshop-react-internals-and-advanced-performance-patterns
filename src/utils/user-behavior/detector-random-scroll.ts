import type { BehaviorEvent, ScrollEvent } from './types';

export class RandomScrollDetector {
  private scrollEvents: ScrollEvent[] = [];
  private velocityThreshold: number;
  private directionChangeThreshold: number;
  private timeWindow: number;
  private lastDirection: 'up' | 'down' | null = null;
  private directionChanges = 0;

  constructor(
    velocityThreshold = 100,
    directionChangeThreshold = 3,
    timeWindow = 2000
  ) {
    this.velocityThreshold = velocityThreshold;
    this.directionChangeThreshold = directionChangeThreshold;
    this.timeWindow = timeWindow;
  }

  public addScrollEvent(event: WheelEvent | Event): BehaviorEvent | null {
    const now = Date.now();
    const target = event.target as Element;

    // Get scroll information
    const scrollTop = target?.scrollTop ?? window.scrollY;
    const scrollLeft = target?.scrollLeft ?? window.scrollX;

    // Calculate delta for wheel events
    let deltaY = 0;
    let deltaX = 0;

    if (event instanceof WheelEvent) {
      deltaY = event.deltaY;
      deltaX = event.deltaX;
    } else {
      // For regular scroll events, calculate delta from previous position
      const prevEvent = this.scrollEvents[this.scrollEvents.length - 1];
      if (prevEvent) {
        deltaY = scrollTop - prevEvent.scrollTop;
        deltaX = scrollLeft - prevEvent.scrollLeft;
      }
    }

    // Add the new scroll event
    this.scrollEvents.push({
      timestamp: now,
      scrollTop,
      scrollLeft,
      deltaY,
      deltaX,
    });

    // Remove old events outside the time window
    this.scrollEvents = this.scrollEvents.filter(
      (scrollEvent) => now - scrollEvent.timestamp <= this.timeWindow
    );

    // Check for direction changes
    if (deltaY !== 0) {
      const currentDirection = deltaY > 0 ? 'down' : 'up';

      if (
        this.lastDirection !== null &&
        this.lastDirection !== currentDirection
      ) {
        this.directionChanges++;
      }

      this.lastDirection = currentDirection;
    }

    // Reset direction changes if outside time window
    if (this.scrollEvents.length <= 1) {
      this.directionChanges = 0;
      this.lastDirection = null;
    }

    // Check for random scrolling
    if (this.isRandomScrolling()) {
      return {
        type: 'random-scrolling',
        timestamp: now,
        data: {
          directionChanges: this.directionChanges,
          velocity: this.calculateScrollVelocity(),
          events: this.scrollEvents.length,
        },
      };
    }

    return null;
  }

  private isRandomScrolling() {
    // Check if there are enough events to analyze
    if (this.scrollEvents.length < 3) {
      return false;
    }

    // Check for high velocity
    const velocity = this.calculateScrollVelocity();
    const hasHighVelocity = velocity > this.velocityThreshold;

    // Check for frequent direction changes
    const hasFrequentDirectionChanges =
      this.directionChanges >= this.directionChangeThreshold;

    return hasHighVelocity && hasFrequentDirectionChanges;
  }

  private calculateScrollVelocity() {
    if (this.scrollEvents.length < 2) {
      return 0;
    }

    // Calculate average velocity over the last few events
    let totalDelta = 0;
    let totalTime = 0;

    for (
      let eventIndex = 1;
      eventIndex < this.scrollEvents.length;
      eventIndex++
    ) {
      const current = this.scrollEvents[eventIndex];
      const previous = this.scrollEvents[eventIndex - 1];

      totalDelta += Math.abs(current.deltaY);
      totalTime += current.timestamp - previous.timestamp;
    }

    // Avoid division by zero
    if (totalTime === 0) {
      return 0;
    }

    return (totalDelta / totalTime) * 1000; // pixels per second
  }

  public reset() {
    this.scrollEvents = [];
    this.lastDirection = null;
    this.directionChanges = 0;
  }
}
