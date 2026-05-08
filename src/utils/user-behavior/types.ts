export interface Point {
  x: number;
  y: number;
}

export interface ClickEvent {
  timestamp: number;
  position: Point;
  target: EventTarget | null;
}

export interface ScrollEvent {
  timestamp: number;
  scrollTop: number;
  scrollLeft: number;
  deltaY: number;
  deltaX: number;
}

export interface MouseMoveEvent {
  timestamp: number;
  position: Point;
  velocity: number;
}

// Make all properties in BehaviorDetectionOptions optional
export interface BehaviorDetectionOptions {
  rageClick?: {
    enabled?: boolean;
    threshold?: number;
    timeWindow?: number;
    radius?: number;
  };
  deadClick?: {
    enabled?: boolean;
    interactiveSelectors?: string[];
  };
  randomScrolling?: {
    enabled?: boolean;
    velocityThreshold?: number;
    directionChangeThreshold?: number;
    timeWindow?: number;
  };
  erraticMouse?: {
    enabled?: boolean;
    velocityThreshold?: number;
    angleThreshold?: number;
    minDistance?: number;
    timeWindow?: number;
  };
  debug?: boolean;
}

export type BehaviorType =
  | 'rage-click'
  | 'dead-click'
  | 'random-scrolling'
  | 'erratic-mouse';

export interface BehaviorEvent {
  type: BehaviorType;
  subtype?: 'high-velocity' | 'direction-changes' | 'combined';
  timestamp: number;
  data: Record<string, unknown>;
}

export type BehaviorEventCallback = (event: BehaviorEvent) => void;
