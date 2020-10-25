'use strict';

(() => {
  const DEBOUNCE_INTERVAL = 500; // ms

  window.debounce = (cb) => {

    let lastTimeout = null;

    return () => {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(() => {
        cb.apply();
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
