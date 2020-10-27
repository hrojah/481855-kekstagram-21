'use strict';

(() => {
  const KEYDOWN = {
    enter: `Enter`,
    esc: `Escape`,
  };
  const DEBOUNCE_INTERVAL = 500;

  const onPressEsc = (evt, callback) => {
    if (evt.key === KEYDOWN.esc) {
      evt.preventDefault();
      callback();
    }
  };

  const onPressEnter = (evt, callback) => {
    if (evt.key === KEYDOWN.enter) {
      callback(evt);
    }
  };

  const debounce = (cb) => {

    let lastTimeout = null;

    return (...parameters) => {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(() => {
        cb.apply(...parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    onPressEnter,
    onPressEsc,
    debounce,
    KEYDOWN,
  };
})();
