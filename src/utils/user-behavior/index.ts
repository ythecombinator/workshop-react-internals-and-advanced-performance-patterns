import logger from '@utils/logger';

import { DeadClickDetector } from './detector-dead-click';
import { ErraticMouseDetector } from './detector-erratic-mouse';
import { RageClickDetector } from './detector-rage-click';
import { RandomScrollDetector } from './detector-random-scroll';
import type {
  BehaviorDetectionOptions,
  BehaviorEvent,
  BehaviorEventCallback,
} from './types';

export * from './types';

//  ---------------------------------------------------------------------------
//  CORE
//  ---------------------------------------------------------------------------

export class UserBehaviorTracker {
  private options: BehaviorDetectionOptions;
  private rageClickDetector: RageClickDetector | null = null;
  private deadClickDetector: DeadClickDetector | null = null;
  private scrollDetector: RandomScrollDetector | null = null;
  private mouseDetector: ErraticMouseDetector | null = null;
  private callbacks: BehaviorEventCallback[] = [];
  private isTracking = false;

  constructor(options: BehaviorDetectionOptions = {}) {
    // Default options
    const defaultOptions: Required<BehaviorDetectionOptions> = {
      rageClick: {
        enabled: true,
        threshold: 3,
        timeWindow: 1000,
        radius: 20,
      },
      deadClick: {
        enabled: true,
        interactiveSelectors: [
          'a',
          'button',
          'input',
          'select',
          'textarea',
          '[role="button"]',
          '[role="link"]',
          '[role="checkbox"]',
          '[role="radio"]',
          '[role="tab"]',
          '[role="menuitem"]',
          '[tabindex]',
          '.clickable',
          '[onclick]',
        ],
      },
      randomScrolling: {
        enabled: true,
        velocityThreshold: 100,
        directionChangeThreshold: 3,
        timeWindow: 2000,
      },
      erraticMouse: {
        enabled: true,
        velocityThreshold: 1000,
        angleThreshold: 45,
        minDistance: 10,
        timeWindow: 1000,
      },
      debug: false,
    };

    // Merge options with defaults
    this.options = {
      rageClick: { ...defaultOptions.rageClick, ...options.rageClick },
      deadClick: { ...defaultOptions.deadClick, ...options.deadClick },
      randomScrolling: {
        ...defaultOptions.randomScrolling,
        ...options.randomScrolling,
      },
      erraticMouse: { ...defaultOptions.erraticMouse, ...options.erraticMouse },
      debug: options.debug ?? defaultOptions.debug,
    };

    // Initialize detectors based on options
    this.initializeDetectors();
  }

  private initializeDetectors() {
    if (this.options.rageClick?.enabled) {
      const {
        threshold = 3,
        timeWindow = 1000,
        radius = 20,
      } = this.options.rageClick;
      this.rageClickDetector = new RageClickDetector(
        threshold,
        timeWindow,
        radius
      );
    }

    if (this.options.deadClick?.enabled) {
      const { interactiveSelectors } = this.options.deadClick;
      this.deadClickDetector = new DeadClickDetector(interactiveSelectors);
    }

    if (this.options.randomScrolling?.enabled) {
      const {
        velocityThreshold = 100,
        directionChangeThreshold = 3,
        timeWindow = 2000,
      } = this.options.randomScrolling;
      this.scrollDetector = new RandomScrollDetector(
        velocityThreshold,
        directionChangeThreshold,
        timeWindow
      );
    }

    if (this.options.erraticMouse?.enabled) {
      const {
        velocityThreshold = 1000,
        angleThreshold = 45,
        minDistance = 10,
        timeWindow = 1000,
      } = this.options.erraticMouse;
      this.mouseDetector = new ErraticMouseDetector(
        velocityThreshold,
        angleThreshold,
        minDistance,
        timeWindow
      );
    }
  }

  public startTracking() {
    if (this.isTracking) {
      return;
    }

    this.isTracking = true;

    // Add event listeners
    if (this.rageClickDetector || this.deadClickDetector) {
      document.addEventListener('click', this.handleClick);
    }

    if (this.scrollDetector) {
      window.addEventListener('wheel', this.handleScroll);
      window.addEventListener('scroll', this.handleScroll);
    }

    if (this.mouseDetector) {
      document.addEventListener('mousemove', this.handleMouseMove);
    }

    this.log('User behavior tracking started');
  }

  public stopTracking() {
    if (!this.isTracking) {
      return;
    }

    this.isTracking = false;

    // Remove event listeners
    document.removeEventListener('click', this.handleClick);
    window.removeEventListener('wheel', this.handleScroll);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('mousemove', this.handleMouseMove);

    this.log('User behavior tracking stopped');
  }

  public reset() {
    this.rageClickDetector?.reset();
    this.scrollDetector?.reset();
    this.mouseDetector?.reset();

    this.log('User behavior tracking reset');
  }

  public onBehaviorDetected(callback: BehaviorEventCallback): () => void {
    this.callbacks.push(callback);

    // Return a function to remove the callback
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  private handleClick = (event: MouseEvent) => {
    let behaviorEvent: BehaviorEvent | null = null;

    // Check for rage clicks
    if (this.rageClickDetector) {
      behaviorEvent = this.rageClickDetector.addClick(event);
      if (behaviorEvent) {
        this.notifyCallbacks(behaviorEvent);
      }
    }

    // Check for dead clicks
    if (this.deadClickDetector) {
      behaviorEvent = this.deadClickDetector.checkClick(event);
      if (behaviorEvent) {
        this.notifyCallbacks(behaviorEvent);
      }
    }
  };

  private handleScroll = (event: WheelEvent | Event) => {
    if (this.scrollDetector) {
      const behaviorEvent = this.scrollDetector.addScrollEvent(event);
      if (behaviorEvent) {
        this.notifyCallbacks(behaviorEvent);
      }
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (this.mouseDetector) {
      const behaviorEvent = this.mouseDetector.addMouseMove(event);
      if (behaviorEvent) {
        this.notifyCallbacks(behaviorEvent);
      }
    }
  };

  private notifyCallbacks(event: BehaviorEvent) {
    this.log(
      `Behavior detected: ${event.type}${event.subtype ? ` (${event.subtype})` : ''}`,
      event
    );

    // Notify all callbacks
    this.callbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in behavior callback:', error);
      }
    });
  }

  private log(message: string, data?: unknown) {
    if (this.options.debug) {
      logger.info(`[UserBehaviorTracker] ${message}`, data || '');
    }
  }
}
