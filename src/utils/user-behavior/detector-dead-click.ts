import type { BehaviorEvent } from './types';

export class DeadClickDetector {
  private interactiveSelectors: string[];

  constructor(
    interactiveSelectors: string[] = [
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
    ]
  ) {
    this.interactiveSelectors = interactiveSelectors;
  }

  public checkClick(event: MouseEvent): BehaviorEvent | null {
    const target = event.target as HTMLElement;

    if (!target) {
      return null;
    }

    if (!this.isInteractive(target)) {
      return {
        type: 'dead-click',
        timestamp: Date.now(),
        data: {
          position: { x: event.clientX, y: event.clientY },
          element: this.getElementDescription(target),
        },
      };
    }

    return null;
  }

  private isInteractive(element: HTMLElement) {
    // Check if the element or any of its parents match the interactive selectors
    let current: HTMLElement | null = element;

    while (current) {
      // 1. Check for common interactive elements by tag name
      const interactiveTags = [
        'a',
        'button',
        'input',
        'select',
        'textarea',
        'summary',
        'details',
      ];
      if (interactiveTags.includes(current.tagName.toLowerCase())) {
        return true;
      }

      // 2. Check for ARIA roles that indicate interactivity
      const role = current.getAttribute('role');
      if (
        role &&
        [
          'button',
          'link',
          'checkbox',
          'radio',
          'tab',
          'menuitem',
          'switch',
          'combobox',
          'option',
        ].includes(role)
      ) {
        return true;
      }

      // 3. Check for tabindex attribute (including tabindex="0")
      if (current.hasAttribute('tabindex')) {
        return true;
      }

      // 4. Check for cursor style that indicates interactivity
      const computedStyle = window.getComputedStyle(current);
      if (['pointer', 'grab', 'grabbing'].includes(computedStyle.cursor)) {
        return true;
      }

      // 5. Check for event listeners via class names that suggest interactivity
      const classNames = Array.from(current.classList);
      if (
        classNames.some(
          (cls) =>
            cls.includes('button') ||
            cls.includes('clickable') ||
            cls.includes('interactive') ||
            cls.includes('control') ||
            cls.includes('btn')
        )
      ) {
        return true;
      }

      // 6. Check for data attributes that suggest interactivity
      const dataAttributes = Array.from(current.attributes)
        .filter((attr) => attr.name.startsWith('data-'))
        .map((attr) => attr.name);

      if (
        dataAttributes.some(
          (attr) =>
            attr.includes('click') ||
            attr.includes('action') ||
            attr.includes('toggle') ||
            attr.includes('control')
        )
      ) {
        return true;
      }

      // 7. Check for custom selectors
      for (const selector of this.interactiveSelectors) {
        try {
          if (current.matches(selector)) {
            return true;
          }
        } catch (error) {
          // Some selectors might not be valid in all contexts
          console.error(`Invalid selector: ${selector}`, error);
        }
      }

      // Move up to the parent
      current = current.parentElement;
    }

    return false;
  }

  private getElementDescription(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = Array.from(element.classList)
      .map((className) => `.${className}`)
      .join('');

    return `${tagName}${id}${classes}`;
  }
}
