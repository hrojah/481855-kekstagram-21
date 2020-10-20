'use strict';

(() => {
  const MAX_HASHTAGS = 5;
  const MAX_SYMBOL = 20;
  const REG = /#[a-zA-Zа-яА-ЯёЁ0-9]{1,19}/i;
  const VALIDATION_MESSAGES = {
    maxTags: `не больше 5 хэштегов`,
    repeatTags: `хэштеги не должны повторяться`,
    regularTags: `недопустимые символы`,
    numberTags: `длина хэштега не более 20 символов`,
    success: ``,
  };
  const main = document.querySelector(`main`);
  const errorModal = document.querySelector(`#error`).content.querySelector(`section`);
  const successModal = document.querySelector(`#success`).content.querySelector(`section`);
  const form = document.querySelector(`.img-upload__form`);
  const hashtagsText = form.querySelector(`.text__hashtags`);
  const succesInner = document.querySelector(`.success__inner`);
  const errorInner = document.querySelector(`.error__inner`);
  let successWindow;
  let successButton;
  let errorWindow;
  let errorButton;

  const hashtagsNumber = (hashtaglist) => {
    return hashtaglist.length > MAX_HASHTAGS;
  };

  const hashtagsRepeat = (hashtag, hashtaglist) => {
    for (let j = 0; j < hashtaglist.length; j++) {
      if (hashtag === hashtaglist[j]) {
        return true;
      }
    }
    return false;
  };

  const regularHashtag = (hashtag) => {
    return !REG.test(hashtag);
  };

  const hashtagSymbols = (hashtag) => {
    return hashtag.length > MAX_SYMBOL;
  };

  const showValidationMessage = (msg) => {
    hashtagsText.setCustomValidity(msg);
    hashtagsText.reportValidity();
  };

  const hashtagValidity = () => {
    const hashes = hashtagsText.value.toLowerCase().trim();
    if (!hashes) {
      return VALIDATION_MESSAGES.success;
    }
    const hashtags = hashes.split(` `);
    if (hashtagsNumber(hashtags)) {
      return VALIDATION_MESSAGES.maxTags;
    }
    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = hashtags[i];
      if (hashtagsRepeat(hashtag, hashtags.slice(i + 1))) {
        return VALIDATION_MESSAGES.repeatTags;
      }
      if (regularHashtag(hashtag)) {
        return VALIDATION_MESSAGES.regularTags;
      }
      if (hashtagSymbols(hashtag)) {
        return VALIDATION_MESSAGES.numberTags;
      }
    }
    return VALIDATION_MESSAGES.success;
  };

  const closeErrorModal = () => {
    errorWindow.remove();
    errorButton.removeEventListener(`click`, closeErrorModal);
    document.removeEventListener(`keydown`, closeErrorModal);
    document.removeEventListener(`click`, closeErrorModal);
  };

  const closeSuccessModal = () => {
    successWindow.remove();
    successButton.removeEventListener(`click`, closeSuccessModal);
    document.removeEventListener(`keydown`, closeSuccessModal);
    document.removeEventListener(`click`, closeSuccessModal);
  };

  const upload = () => {
    window.upload(new FormData(form), () => {
      successWindow = successModal.cloneNode(true);
      main.append(successWindow);
      window.overlay.closeOverlay();
      successButton = document.querySelector(`.success__button`);
      successButton.addEventListener(`click`, closeSuccessModal);
      document.addEventListener(`click`, (evt) => {
        if (evt.target !== succesInner) {
          closeSuccessModal();
        }
      });
      document.addEventListener(`keydown`, (keydownEvent) => {
        window.util.onPressEsc(keydownEvent, closeSuccessModal);
      });
    }, () => {
      errorWindow = errorModal.cloneNode(true);
      main.append(errorWindow);
      window.overlay.closeOverlay();
      errorButton = document.querySelector(`.error__button`);
      errorButton.addEventListener(`click`, closeErrorModal);
      document.addEventListener(`keydown`, (keydownEvent) => {
        window.util.onPressEsc(keydownEvent, closeErrorModal);
      });
      document.addEventListener(`click`, (evt) => {
        if (evt.target !== errorInner) {
          closeSuccessModal();
        }
      });
    });
  };

  const formSubmit = (evt) => {
    evt.preventDefault();
    const validationMessage = hashtagValidity();
    showValidationMessage(validationMessage);
    if (validationMessage === VALIDATION_MESSAGES.success) {
      upload();
    }
  };

  hashtagsText.addEventListener(`input`, () => {
    showValidationMessage(VALIDATION_MESSAGES.success);
  });

  form.addEventListener(`submit`, formSubmit);
  form.addEventListener(`change`, window.effects.effectChangeHandler);

  window.form = {
    hashtagsText,
    form,
  };
})();
