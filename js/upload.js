'use strict';

(() => {
  let URL = `https://21.javascript.pages.academy/kekstagram/`;

  window.upload = (data, onSuccess, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, () => {
      onSuccess(xhr.response);
    }, onError);

    xhr.open(`POST`, URL);
    xhr.send(data);
  };
})();
