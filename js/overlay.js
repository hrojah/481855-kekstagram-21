'use strict';

(() => {
  const body = document.querySelector(`body`);
  const upload = document.querySelector(`#upload-file`);
  const uploadOverlay = document.querySelector(`.img-upload__overlay`);
  const uploadCancel = uploadOverlay.querySelector(`#upload-cancel`);
  const commentsText = document.querySelector(`.text__description`);
  const openOverlay = () => {
    uploadOverlay.classList.remove(`hidden`);
    body.classList.add(`modal-open`);
    window.effects.filterScale.classList.add(`hidden`);
    document.addEventListener(`keydown`, (evt) => {
      if (evt.target === window.form.hashtagsText || evt.target === commentsText) {
        evt.preventDefault();
      } else {
        closeOverlay();
      }
    });
  };

  const closeOverlay = () => {
    uploadOverlay.classList.add(`hidden`);
    body.classList.remove(`modal-open`);
    document.removeEventListener(`keydown`, window.util.onPressEsc);
    window.effects.scaleSmaller.removeEventListener(`click`, window.effects.declineScale);
    window.effects.scaleBigger.removeEventListener(`click`, window.effects.increaseScale);
    upload.value = ``;
    window.effects.imgPreview.style.transform = `scale(1)`;
    window.effects.imgPreview.style.filter = ``;
    window.effects.imgPreview.className = ``;
    window.form.hashtagsText.value = ``;
  };
  upload.addEventListener(`change`, () => {
    openOverlay();
  });

  uploadCancel.addEventListener(`click`, () => {
    closeOverlay();
  });

  uploadCancel.addEventListener(`keydown`, (evt) => {
    window.util.onPressEnter(evt, closeOverlay);
  });
})();
