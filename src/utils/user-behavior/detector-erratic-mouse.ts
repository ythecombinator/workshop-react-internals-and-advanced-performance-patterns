import type { BehaviorEvent, MouseMoveEvent, Point } from './types';

type Subtype = 'high-velocity' | 'direction-changes' | 'combined';

export class ErraticMouseDetector {
  private mouseMoves: MouseMoveEvent[] = [];
  private velocityThreshold: number;
  private angleThreshold: number;
  private minDistance: number;
  private timeWindow: number;
  private lastPosition: Point | null = null;
  private lastTimestamp = 0;

  constructor(
    velocityThreshold = 1000,
    angleThreshold = 45,
    minDistance = 10,
    timeWindow = 1000
  ) {
    this.velocityThreshold = velocityThreshold;
    this.angleThreshold = angleThreshold;
    this.minDistance = minDistance;
    this.timeWindow = timeWindow;
  }

  public addMouseMove(event: MouseEvent): BehaviorEvent | null {
    const now = Date.now();
    const position: Point = { x: event.clientX, y: event.clientY };

    // Calculate velocity if we have a previous position
    let velocity = 0;

    if (this.lastPosition && this.lastTimestamp) {
      const distance = this.getDistance(this.lastPosition, position);
      const timeDiff = now - this.lastTimestamp;

      // Only process significant movements to avoid micro-movements
      if (distance >= this.minDistance) {
        velocity = (distance / timeDiff) * 1000; // pixels per second

        this.mouseMoves.push({
          timestamp: now,
          position,
          velocity,
        });
      }
    }

    // Update last position and timestamp
    this.lastPosition = position;
    this.lastTimestamp = now;

    // Remove old events outside the time window
    this.mouseMoves = this.mouseMoves.filter(
      (moveEvent) => now - moveEvent.timestamp <= this.timeWindow
    );

    // We need enough events to analyze
    if (this.mouseMoves.length < 5) {
      return null;
    }

    // Check for high velocity
    const avgVelocity =
      this.mouseMoves.reduce((sum, moveEvent) => sum + moveEvent.velocity, 0) /
      this.mouseMoves.length;
    const hasHighVelocity = avgVelocity > this.velocityThreshold;

    // Check for direction changes
    let directionChanges = 0;

    for (let moveIndex = 2; moveIndex < this.mouseMoves.length; moveIndex++) {
      const pointA = this.mouseMoves[moveIndex - 2].position;
      const pointB = this.mouseMoves[moveIndex - 1].position;
      const pointC = this.mouseMoves[moveIndex].position;

      const angleA = this.calculateAngle(pointA, pointB);
      const angleB = this.calculateAngle(pointB, pointC);

      const angleDiff = Math.abs(angleB - angleA);

      // Count significant direction changes
      if (angleDiff > this.angleThreshold) {
        directionChanges++;
      }
    }

    const hasFrequentDirectionChanges = directionChanges >= 3;

    // Determine if we have erratic mouse movement and what type
    if (hasHighVelocity || hasFrequentDirectionChanges) {
      let subtype: Subtype = 'combined';

      if (hasHighVelocity && !hasFrequentDirectionChanges) {
        subtype = 'high-velocity';
      } else if (!hasHighVelocity && hasFrequentDirectionChanges) {
        subtype = 'direction-changes';
      }

      return {
        type: 'erratic-mouse',
        subtype,
        timestamp: now,
        data: {
          avgVelocity,
          directionChanges,
          events: this.mouseMoves.length,
          duration:
            this.mouseMoves[this.mouseMoves.length - 1].timestamp -
            this.mouseMoves[0].timestamp,
        },
      };
    }

    return null;
  }

  private getDistance(pointA: Point, pointB: Point) {
    return Math.sqrt(
      Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
    );
  }

  private calculateAngle(pointA: Point, pointB: Point) {
    return (
      Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * (180 / Math.PI)
    );
  }

  public reset() {
    this.mouseMoves = [];
    this.lastPosition = null;
    this.lastTimestamp = 0;
  }
}
