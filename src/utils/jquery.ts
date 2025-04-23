import { useEffect, useState } from 'react';

import logger from '@utils/logger';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

declare global {
  interface Window {
    jQuery: JQueryStatic;
    $: JQueryStatic;
  }
}

//  ---------------------------------------------------------------------------
//  UTILS
//  ---------------------------------------------------------------------------

export function useJQuery() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';

    script.onload = () => {
      logger.success('[Detecting jQuery] jQuery loaded successfully');
      setLoaded(true);
      patchjQuery();
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return loaded;
}

function createjQueryObjectProxy(jQueryObj: JQuery) {
  return new Proxy(jQueryObj, {
    get: (target: JQuery, prop: string | symbol, receiver: any): any => {
      const value = Reflect.get(target, prop, receiver);

      // If the property is a function, create a proxy for it
      if (typeof value === 'function' && prop !== 'constructor') {
        return (...args: any[]): any => {
          logger.info(
            `[Detecting jQuery] Called $(...).${String(prop)}() with arguments`,
            args
          );

          // Call the original method
          const result = value.apply(target, args);

          // If the result is the jQuery object itself (for chaining), return the proxy
          if (result === target) {
            return receiver;
          }

          // If the result is another jQuery object, wrap it in a proxy
          if (result && typeof result === 'object' && result.jquery) {
            return createjQueryObjectProxy(result);
          }

          return result;
        };
      }

      return value;
    },
  });
}

//  ---------------------------------------------------------------------------
//  CORE
//  ---------------------------------------------------------------------------

export function patchjQuery() {
  if (typeof window === 'undefined' || !window.$) {
    console.error('jQuery not found in window object');
    return false;
  }

  const originalJQuery: JQueryStatic = window.$;

  // Create a proxy for jQuery function
  const jQueryProxy = new Proxy(originalJQuery, {
    apply: (
      target: JQueryStatic,
      thisArg: any,
      argumentsList: any[]
    ): JQuery => {
      logger.info(
        '[Detecting jQuery] Called jQuery() with arguments',
        argumentsList
      );

      // Call the original jQuery function
      const result = Reflect.apply(target, thisArg, argumentsList) as JQuery;

      // If the result is a jQuery object, wrap it in a proxy too
      if (result && typeof result === 'object' && result.jquery) {
        return createjQueryObjectProxy(result);
      }

      return result;
    },

    // Handle properties on jQuery itself (like $.ajax)
    get: (target: JQueryStatic, prop: string | symbol, receiver: any): any => {
      const value = Reflect.get(target, prop, receiver);

      if (typeof value === 'function' && prop !== 'constructor') {
        return (...args: any[]): any => {
          logger.info(
            `[Detecting jQuery] Called $.${String(prop)}() with arguments`,
            args
          );

          // Call the original method
          const result = value.apply(target, args);
          return result;
        };
      }

      return value;
    },
  });

  // Replace the global jQuery with our proxy
  window.jQuery = jQueryProxy;
  window.$ = jQueryProxy;

  logger.success('[Detecting jQuery] Successfully patched jQuery with Proxy');
  return true;
}
