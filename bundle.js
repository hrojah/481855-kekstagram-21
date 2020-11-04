/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
(() => {
/*!*********************!*\
  !*** ./js/utils.js ***!
  \*********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const KEYDOWN = {
  enter: `Enter`,
  esc: `Escape`
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

(() => {
/*!*******************!*\
  !*** ./js/api.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const URL_LOAD = `https://21.javascript.pages.academy/kekstagram/data`;
const URL_UPLOAD = `https://21.javascript.pages.academy/kekstagram/`;
const STATUS_CODE = {
  OK: 200
};
const TIMEOUT = 10000;

const ajax = (method, url, data, onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    if (xhr.status === STATUS_CODE.OK) {
      onSuccess(xhr.response);
    } else {
      onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });
  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполнится за ${xhr.timeout} мс`);
  });

  xhr.timeout = TIMEOUT;

  xhr.open(method, url);
  xhr.send(data);
};

const load = (onSuccess, onError) => {
  ajax(`GET`, URL_LOAD, null, onSuccess, onError);
};

const upload = (data, onSuccess, onError) => {
  ajax(`POST`, URL_UPLOAD, data, onSuccess, onError);
};

window.api = {
  load,
  upload,
};


})();

(() => {
/*!***********************!*\
  !*** ./js/gallery.js ***!
  \***********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let photoDescription;
const cardsPicture = document.querySelector(`#picture`).content.querySelector(`a`);
const errorModal = document.querySelector(`#error`).content.querySelector(`section`);
const filter = document.querySelector(`.img-filters`);
const pictures = document.querySelector(`.pictures`);

const getPhotos = () => {
  return photoDescription;
};

const renderPicture = (photo) => {
  const pictureElement = cardsPicture.cloneNode(true);
  pictureElement.id = photo.id;
  pictureElement.querySelector(`.picture__img`).src = photo.url;
  pictureElement.querySelector(`.picture__likes`).textContent = photo.likes;
  pictureElement.querySelector(`.picture__comments`).textContent = photo.comments.length;

  return pictureElement;
};

const createPictures = (photos) => {
  const pictureFragment = document.createDocumentFragment();
  for (let i = 0; i < photos.length; i++) {
    pictureFragment.append(renderPicture(photos[i]));
  }
  pictures.append(pictureFragment);
};

window.api.load((response) => {
  photoDescription = response.map((item, index) => {
    item.id = index;
    return item;
  });
  createPictures(photoDescription);
  filter.classList.remove(`img-filters--inactive`);
  window.preview.initPictureHandlers();
}, (errorMessage) => {
  const errorWindow = errorModal.cloneNode(true);
  const errorContainer = errorWindow.querySelector(`.error__inner`);
  const errorButton = errorWindow.querySelector(`.error__button`);
  errorContainer.removeChild(errorButton);
  errorContainer.style.width = `${700}px`;
  errorWindow.querySelector(`.error__title`).textContent = errorMessage;
  window.form.main.append(errorWindow);
});

window.gallery = {
  pictures,
  getPhotos,
  createPictures,
};

})();

(() => {
/*!***********************!*\
  !*** ./js/preview.js ***!
  \***********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const NEW_COMMENTS = 5;
const bigPicture = document.querySelector(`.big-picture`);
const commentsLoader = bigPicture.querySelector(`.comments-loader`);
const socialComments = bigPicture.querySelector(`.social__comments`);
const socialCommentText = bigPicture.querySelector(`.social__footer-text`);
const closeBigPicture = bigPicture.querySelector(`.big-picture__cancel`);
const bigPictureImg = bigPicture.querySelector(`.big-picture__img img`);
const likesCount = bigPicture.querySelector(`.likes-count`);
const description = bigPicture.querySelector(`.social__caption`);
const commentsCount = bigPicture.querySelector(`.comments-count`);
const socialCommentCount = bigPicture.querySelector(`.social__comment-count`);
let photoComments;

const renderComment = (comment) => {
  const element = document.createElement(`li`);
  const commentImg = document.createElement(`img`);
  const commentText = document.createElement(`p`);
  element.classList.add(`social__comment`);
  commentImg.classList.add(`social__picture`);
  commentText.classList.add(`social__text`);
  element.append(commentImg, commentText);
  commentImg.src = comment.avatar;
  commentImg.alt = comment.name;
  commentText.textContent = comment.message;
  return element;
};

const modalCloseHandler = () => {
  window.overlay.body.classList.remove(`modal-open`);
  bigPicture.classList.add(`hidden`);
  socialCommentText.value = ``;
  socialComments.innerHTML = ``;
  commentsLoader.classList.remove(`hidden`);
  document.removeEventListener(`keydown`, window.utils.onPressEsc);
  commentsLoader.removeEventListener(`click`, commentsGetMoreHandler);
  commentsLoader.removeEventListener(`keydown`, window.utils.onPressEnter);
};

const modalOpenHandler = (evt) => {
  window.overlay.body.classList.add(`modal-open`);
  const photos = window.gallery.getPhotos();
  const index = parseInt(evt.target.closest(`.picture`).id, 10);
  renderBigPicture(photos[index]);
  bigPicture.classList.remove(`hidden`);
  document.addEventListener(`keydown`, (keydownEvent) => {
    window.utils.onPressEsc(keydownEvent, modalCloseHandler);
  });
  commentsLoader.addEventListener(`click`, commentsGetMoreHandler);
  commentsLoader.addEventListener(`keydown`, (keyEvt) => {
    window.utils.onPressEnter(keyEvt, commentsGetMoreHandler);
  });
};

const commentsGetMoreHandler = () => {
  const commentsList = document.querySelectorAll(`.social__comment`);
  const count = commentsList.length;
  const index = count + NEW_COMMENTS;
  const fiveComments = photoComments.slice(count, index);
  const comments = document.createDocumentFragment();
  for (let i = 0; i < fiveComments.length; i++) {
    comments.appendChild(renderComment(fiveComments[i]));
  }
  socialCommentCount.textContent = `${index} из ${photoComments.length} комментариев`;
  socialComments.append(comments);
  if (fiveComments.length < NEW_COMMENTS) {
    socialCommentCount.textContent = `${photoComments.length} из ${photoComments.length} комментариев`;
    commentsLoader.classList.add(`hidden`);
  }
};

const renderBigPicture = (photo) => {
  bigPictureImg.src = photo.url;
  likesCount.textContent = photo.likes;
  description.textContent = photo.description;
  commentsCount.textContent = photo.comments.length;
  photoComments = photo.comments;
  commentsGetMoreHandler(photo.comments);
};

const initPictureHandlers = () => {
  document.querySelectorAll(`.picture`).forEach((element) => {
    element.addEventListener(`click`, modalOpenHandler);
    element.addEventListener(`keydown`, (evt) => {
      window.utils.onPressEnter(evt, modalOpenHandler);
    });
  });
};

closeBigPicture.addEventListener(`click`, modalCloseHandler);

closeBigPicture.addEventListener(`keydown`, (evt) => {
  window.utils.onPressEnter(evt, modalCloseHandler);
});

window.preview = {
  initPictureHandlers,
};

})();

(() => {
/*!***********************!*\
  !*** ./js/overlay.js ***!
  \***********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const FILE_TYPE = [`gif`, `jpg`, `jpeg`, `png`];
const body = document.body;
const upload = document.querySelector(`#upload-file`);
const uploadOverlay = document.querySelector(`.img-upload__overlay`);
const uploadCancel = uploadOverlay.querySelector(`#upload-cancel`);
const commentsText = document.querySelector(`.text__description`);
const preview = document.querySelector(`.img-upload__image`);

const onOverlayEscPress = (evt) => {
  if (evt.key === window.utils.KEYDOWN.esc) {
    if (evt.target === window.form.hashtagsText || evt.target === commentsText) {
      evt.preventDefault();
    } else {
      evt.preventDefault();
      closeOverlay();
    }
  }
};

const openOverlay = () => {
  uploadOverlay.classList.remove(`hidden`);
  body.classList.add(`modal-open`);
  window.effects.filterScale.classList.add(`hidden`);
  window.effects.scaleSmaller.addEventListener(`click`, window.effects.declineScale);
  window.effects.scaleBigger.addEventListener(`click`, window.effects.increaseScale);
  document.addEventListener(`keydown`, onOverlayEscPress);
};

const closeOverlay = () => {
  uploadOverlay.classList.add(`hidden`);
  body.classList.remove(`modal-open`);
  document.removeEventListener(`keydown`, onOverlayEscPress);
  window.effects.scaleSmaller.removeEventListener(`click`, window.effects.declineScale);
  window.effects.scaleBigger.removeEventListener(`click`, window.effects.increaseScale);
  upload.value = ``;
  window.effects.imgPreview.style.transform = `scale(1)`;
  window.effects.imgPreview.style.filter = ``;
  window.effects.imgPreview.className = ``;
  window.form.hashtagsText.innerHTML = ``;

};

const uploadImage = () => {
  const file = upload.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPE.some((ending) => {
    return fileName.endsWith(ending);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, () => {
      preview.src = reader.result;
    });
    reader.readAsDataURL(file);
  }
};

upload.addEventListener(`change`, () => {
  uploadImage();
  openOverlay();
});

uploadCancel.addEventListener(`click`, () => {
  closeOverlay();
});

uploadCancel.addEventListener(`keydown`, (evt) => {
  window.utils.onPressEnter(evt, closeOverlay);
});

window.overlay = {
  closeOverlay,
  body,
};

})();

(() => {
/*!***********************!*\
  !*** ./js/effects.js ***!
  \***********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const MIN_COORD = 0;
const MAX_COORD = 453;
const SCALE_STEP = 25;
const EFFECTS = {
  chrome: `effects__preview--chrome`,
  sepia: `effects__preview--sepia`,
  marvin: `effects__preview--marvin`,
  phobos: `effects__preview--phobos`,
  heat: `effects__preview--heat`,
};

const EFFECTS_ACTION = {
  'effects__preview--chrome': {
    filter: `grayscale`,
    unit: ``,
    min: 0,
    max: 1,
  },
  'effects__preview--sepia': {
    filter: `sepia`,
    unit: ``,
    min: 0,
    max: 1,
  },
  'effects__preview--marvin': {
    filter: `invert`,
    unit: `%`,
    min: 0,
    max: 100,
  },
  'effects__preview--phobos': {
    filter: `blur`,
    unit: `px`,
    min: 0,
    max: 3,
  },
  'effects__preview--heat': {
    filter: `brightness`,
    unit: ``,
    min: 1,
    max: 3,
  }
};
const imgPreview = document.querySelector(`.img-upload__preview img`);
const scaleValue = document.querySelector(`.scale__control--value`);
const filterScale = document.querySelector(`.img-upload__effect-level`);
const effectLevel = filterScale.querySelector(`.effect-level__value`);
const effectLine = filterScale.querySelector(`.effect-level__depth`);
const pin = filterScale.querySelector(`.effect-level__pin`);
const scaleSmaller = document.querySelector(`.scale__control--smaller`);
const scaleBigger = document.querySelector(`.scale__control--bigger`);

const declineScale = () => {
  const value = parseInt(scaleValue.value, 10);
  if (value > 25) {
    const valueNew = value - SCALE_STEP;
    scaleValue.value = valueNew + `%`;
    const valueTransform = valueNew / 100;
    imgPreview.style.transform = `scale(${valueTransform})`;
  }
};

const increaseScale = () => {
  const value = parseInt(scaleValue.value, 10);
  if (value < 100) {
    const valueNew = value + SCALE_STEP;
    scaleValue.value = valueNew + `%`;
    const valueTransform = valueNew / 100;
    imgPreview.style.transform = `scale(${valueTransform})`;
  }
};

const effectChangeHandler = (evt) => {
  if (evt.target.matches(`input[type='radio']`)) {
    effectLevel.value = 100;
    pin.style.left = MAX_COORD + `px`;
    effectLine.style.width = MAX_COORD + `px`;
    imgPreview.style.transform = `scale(1)`;
    scaleValue.value = 100 + `%`;
    if (evt.target.value in EFFECTS) {
      filterScale.classList.remove(`hidden`);
      imgPreview.removeAttribute(`style`);
      imgPreview.className = EFFECTS[evt.target.value];
    } else if (evt.target.value === `none`) {
      filterScale.classList.add(`hidden`);
      imgPreview.className = ``;
      imgPreview.style.filter = ``;
    }
  }
};

const getFilterValue = (value, min, max) => {
  return ((value * (max - min)) / 100) + min;
};

const getFilter = (effect, value) => {
  value = getFilterValue(value, effect.min, effect.max);
  return `${effect.filter}(${value}${effect.unit})`;
};

const effectLevelHandler = () => {
  const value = parseInt(effectLevel.value, 10);
  if (imgPreview.className in EFFECTS_ACTION) {
    imgPreview.style.filter = getFilter(EFFECTS_ACTION[imgPreview.className], value);
    return;
  }
  imgPreview.style.filter = ``;
};

pin.addEventListener(`mousedown`, (evt) => {
  evt.preventDefault();

  let startCoords = {
    x: evt.clientX,
  };

  const onMouseMove = (moveEvt) => {
    moveEvt.preventDefault();

    let shift = {
      x: startCoords.x - moveEvt.clientX,
    };

    startCoords = {
      x: moveEvt.clientX,
    };

    let coord = (pin.offsetLeft - shift.x);
    if (coord < MIN_COORD) {
      coord = MIN_COORD;
    } else if (coord > MAX_COORD) {
      coord = MAX_COORD;
    }
    pin.style.left = `${coord}px`;
    effectLine.style.width = `${coord}px`;
    effectLevel.value = coord / MAX_COORD * 100;
    effectLevelHandler();
  };

  const onMouseUp = (upEvt) => {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);
  };

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
});

pin.addEventListener(`mouseup`, effectLevelHandler);

window.effects = {
  scaleValue,
  filterScale,
  scaleSmaller,
  scaleBigger,
  imgPreview,
  declineScale,
  increaseScale,
  effectChangeHandler,
  effectLevelHandler,
};

})();

(() => {
/*!********************!*\
  !*** ./js/form.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


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

})();

(() => {
/*!**********************!*\
  !*** ./js/filter.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const defaultFilterButton = document.querySelector(`#filter-default`);
const commentsFilterButton = document.querySelector(`#filter-discussed`);
const randomFilterButton = document.querySelector(`#filter-random`);
const filters = document.querySelector(`.img-filters`);

const selectFilter = (buttonElement) => {
  filters.querySelectorAll(`.img-filters__button--active`).forEach((element) => {
    element.classList.remove(`img-filters__button--active`);
  });
  buttonElement.classList.add(`img-filters__button--active`);

};

const clearPhotos = () => {
  window.gallery.pictures.classList.add(`hidden`);
  const photos = document.querySelectorAll(`.picture`);
  for (let i = 0; i < photos.length; i++) {
    photos[i].remove();
  }
  window.gallery.pictures.classList.remove(`hidden`);
};

const shufflePhotos = (photos) => {
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const element = photos[j];
    photos[j] = photos[i];
    photos[i] = element;
  }
  return photos;
};

const getDefaultPhotos = () => {
  selectFilter(defaultFilterButton);
  clearPhotos();
  window.gallery.createPictures(window.gallery.getPhotos());
  window.preview.initPictureHandlers();
};

const getCountCommentsPhotos = () => {
  selectFilter(commentsFilterButton);
  const photos = window.gallery.getPhotos();
  const commentFilterPhoto = photos.slice();
  clearPhotos();
  window.gallery.createPictures(commentFilterPhoto.sort((left, right) => {
    return right.comments.length - left.comments.length;
  }));
  window.preview.initPictureHandlers();
};

const getRandomPhotos = () => {
  selectFilter(randomFilterButton);
  const photos = window.gallery.getPhotos();
  let randomFilterPhoto = photos.slice();
  shufflePhotos(randomFilterPhoto);
  randomFilterPhoto = randomFilterPhoto.slice(0, 10);
  clearPhotos();
  window.gallery.createPictures(randomFilterPhoto);
  window.preview.initPictureHandlers();
};

const defaultFilter = window.utils.debounce(getDefaultPhotos);
const countCommentsFilter = window.utils.debounce(getCountCommentsPhotos);
const randomFilter = window.utils.debounce(getRandomPhotos);

defaultFilterButton.addEventListener(`click`, defaultFilter);
commentsFilterButton.addEventListener(`click`, countCommentsFilter);
randomFilterButton.addEventListener(`click`, randomFilter);

})();

/******/ })()
;