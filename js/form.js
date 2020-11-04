'use strict';

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

const onSuccess = () => {
  const successWindow = successModal.cloneNode(true);
  const successButton = successWindow.querySelector(`.success__button`);
  successButton.addEventListener(`click`, () => {
    successWindow.remove();
  });
  document.addEventListener(`keydown`, (keydownEvent) => {
    window.utils.onPressEsc(keydownEvent, () => {
      successWindow.remove();
    });
  });
  successWindow.addEventListener(`click`, (evt) => {
    if (!evt.target.closest(`.success__inner`)) {
      successWindow.remove();
    }
  });

  successButton.addEventListener(`blur`, () => successButton.focus());
  main.append(successWindow);
};

const onError = () => {
  const errorWindow = errorModal.cloneNode(true);
  const errorButton = errorWindow.querySelector(`.error__button`);
  errorButton.addEventListener(`click`, () => {
    errorWindow.remove();
  });
  document.addEventListener(`keydown`, (keydownEvent) => {
    window.utils.onPressEsc(keydownEvent, () => {
      errorWindow.remove();
    });
  });
  errorWindow.addEventListener(`click`, (evt) => {
    if (!evt.target.closest(`.error__inner`)) {
      errorWindow();
    }
  });
  errorButton.addEventListener(`blur`, () => errorButton.focus());
  main.append(errorWindow);
};

const formSubmit = (evt) => {
  evt.preventDefault();
  const validationMessage = hashtagValidity();
  showValidationMessage(validationMessage);
  if (validationMessage === VALIDATION_MESSAGES.success) {
    window.api.upload(new FormData(form), onSuccess, onError);
  }
  window.overlay.closeOverlay();
  form.reset();
};

hashtagsText.addEventListener(`input`, () => {
  showValidationMessage(VALIDATION_MESSAGES.success);
});

form.addEventListener(`submit`, formSubmit);
form.addEventListener(`change`, window.effects.effectChangeHandler);

window.form = {
  hashtagsText,
  form,
  main,
};
