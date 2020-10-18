'use strict';

(() => {
  const URL = `https://21.javascript.pages.academy/kekstagram/data`;

  window.load = (onSuccess) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.open(`GET`, URL);

    xhr.addEventListener(`load`, () => {
      onSuccess(xhr.response);
    });

    xhr.send();
  };
})();
