'use strict';

(() => {
  const DEBOUNCE_INTERVAL = 500; // ms

  window.debounce = (cb) => {

    let lastTimeout = null;

    return (...parameters) => {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(() => {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
