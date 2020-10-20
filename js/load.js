'use strict';

(() => {
  const URL = `https://21.javascript.pages.academy/kekstagram/data`;
  const STATUS_CODE = {
    OK: 200
  };
  const TIMEOUT = 10000;

  window.load = (onSuccess, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, () => {
      if (xhr.status === STATUS_CODE.OK) {
        onSuccess(xhr.response);
      } else {
        onError(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
      }
    });

    xhr.addEventListener(`error`, () => {
      onError(`Произошла ошибка соединения`);
    });
    xhr.addEventListener(`timeout`, () => {
      onError(`Запрос не успел выполнится за ` + xhr.timeout + `мс`);
    });

    xhr.timeout = TIMEOUT;

    xhr.open(`GET`, URL);
    xhr.send();
  };
})();
