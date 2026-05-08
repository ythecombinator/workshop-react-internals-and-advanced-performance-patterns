import type { BehaviorEvent, ClickEvent, Point } from './types';

export class RageClickDetector {
  private clicks: ClickEvent[] = [];
  private threshold: number;
  private timeWindow: number;
  private radius: number;

  constructor(threshold = 3, timeWindow = 1000, radius = 20) {
    this.threshold = threshold;
    this.timeWindow = timeWindow;
    this.radius = radius;
  }

  public addClick(event: MouseEvent): BehaviorEvent | null {
    const now = Date.now();
    const position: Point = { x: event.clientX, y: event.clientY };

    // Add the new click
    this.clicks.push({
      timestamp: now,
      position,
      target: event.target,
    });

    // Remove old clicks outside the time window
    this.clicks = this.clicks.filter(
      (click) => now - click.timestamp <= this.timeWindow
    );

    // Check for rage clicks
    const rageClicks = this.detectRageClicks();
    if (rageClicks) {
      return {
        type: 'rage-click',
        timestamp: now,
        data: {
          count: rageClicks.length,
          position,
          target: event.target,
        },
      };
    }

    return null;
  }

  private detectRageClicks(): ClickEvent[] | null {
    // Group clicks that are close to each other
    for (let clickIndex = 0; clickIndex < this.clicks.length; clickIndex++) {
      const clicksInRadius = this.clicks.filter(
        (click) =>
          this.getDistance(click.position, this.clicks[clickIndex].position) <=
          this.radius
      );

      if (clicksInRadius.length >= this.threshold) {
        return clicksInRadius;
      }
    }

    return null;
  }

  private getDistance(pointA: Point, pointB: Point) {
    return Math.sqrt(
      Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
    );
  }

  public reset() {
    this.clicks = [];
  }
}
