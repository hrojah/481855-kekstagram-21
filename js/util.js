'use strict';

(() => {
  const KEYDOWN = {
    enter: `Enter`,
    esc: `Escape`,
  };
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
  window.util = {
    onPressEnter,
    onPressEsc,
    KEYDOWN,
  };
})();
