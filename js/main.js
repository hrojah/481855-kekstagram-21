'use strict';

const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_AVATAR = 1;
const MAX_AVATAR = 6;

const MAX_HASHTAGS = 5;
const MAX_SYMBOL = 20;
const REG = /#[a-zA-Zа-яА-ЯёЁ0-9]{1,19}/i;

const COMMENT_TEXT = [
  `Всё отлично!`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
];

const USER_NAMES = [
  `Антон`,
  `Олег`,
  `Владимир`,
  `Игорь`,
  `Аркадий`,
  `Дмитрий`
];

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

const VALIDATION_MESSAGES = {
  maxTags: `не больше 5 хэштегов`,
  repeatTags: `хэштеги не должны повторяться`,
  regularTags: `недопустимые символы`,
  numberTags: `длина хэштега не более 20 символов`,
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getCommentText = () => {
  return COMMENT_TEXT[getRandomNumber(0, COMMENT_TEXT.length - 1)];
};

const getUserName = () => {
  return USER_NAMES[getRandomNumber(0, USER_NAMES.length - 1)];
};

const getComments = (commentNumber) => {
  const comment = [];
  for (let i = 1; i <= commentNumber; i++) {
    comment.push({
      avatar: `img/avatar-${getRandomNumber(MIN_AVATAR, MAX_AVATAR)}.svg`,
      message: getCommentText(),
      name: getUserName()
    });
  }
  return comment;
};

const createPhotoDescriptionArray = (values) => {
  const photoDescription = [];
  for (let i = 1; i <= values; i++) {
    photoDescription.push({
      url: `photos/${i}.jpg`,
      description: ``,
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: getComments(getRandomNumber(1, 5))
    });
  }
  return photoDescription;
};


const renderPicture = (photoDescription) => {
  const pictureElement = cardsPicture.cloneNode(true);

  pictureElement.querySelector(`.picture__img`).src = photoDescription.url;
  pictureElement.querySelector(`.picture__likes`).textContent = photoDescription.likes;
  pictureElement.querySelector(`.picture__comments`).textContent = photoDescription.comments.length;

  return pictureElement;
};

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

const renderBigPicture = (photo) => {
  bigPicture.querySelector(`.big-picture__img img`).src = photo.url;
  bigPicture.querySelector(`.likes-count`).textContent = photo.likes;
  bigPicture.querySelector(`.social__caption`).textContent = photo.description;
  bigPicture.querySelector(`.comments-count`).textContent = photo.comments.length;
  const comments = document.createDocumentFragment();
  for (let i = 0; i < photo.comments.length; i++) {
    comments.appendChild(renderComment(photo.comments[i]));
  }
  socialComments.innerHTML = ``;
  socialComments.append(comments);
};

const onOverlayEscPress = (evt) => {
  if (evt.key === `Escape`) {
    if (evt.target === hashtagsText) {
      evt.preventDefault();
    } else {
      evt.preventDefault();
      uploadOverlay.classList.add(`hidden`);
      body.classList.remove(`modal-open`);
    }
  }
};

const openOverlay = () => {
  uploadOverlay.classList.remove(`hidden`);
  body.classList.add(`modal-open`);
  filterScale.classList.add(`hidden`);
  document.addEventListener(`keydown`, onOverlayEscPress);
};

const closeOverlay = () => {
  uploadOverlay.classList.add(`hidden`);
  body.classList.remove(`modal-open`);
  document.removeEventListener(`keydown`, onOverlayEscPress);
  scaleSmaller.removeEventListener(`click`, declineScale);
  scaleBigger.removeEventListener(`click`, increaseScale);
  upload.value = ``;
  imgPreview.style.transform = `scale(1)`;
  imgPreview.style.filter = ``;
  imgPreview.className = ``;
  hashtagsText.value = ``;
};

const declineScale = () => {
  const value = parseInt(scaleValue.value, 10);
  if (value > 25) {
    const valueNew = value - 25;
    scaleValue.value = valueNew + `%`;
    const valueTransform = valueNew / 100;
    imgPreview.style.transform = `scale(${valueTransform})`;
  }
};

const increaseScale = () => {
  const value = parseInt(scaleValue.value, 10);
  if (value < 100) {
    const valueNew = value + 25;
    scaleValue.value = valueNew + `%`;
    const valueTransform = valueNew / 100;
    imgPreview.style.transform = `scale(${valueTransform})`;
  }
};

const effectChangeHandler = (evt) => {
  if (evt.target.matches(`input[type='radio']`)) {
    effectLevel.value = 100;
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

const hashtagValidity = () => {
  const hashtags = hashtagsText.value.toLowerCase().trim().split(` `);
  if (hashtagsNumber(hashtags)) {
    return hashtagsText.setCustomValidity(VALIDATION_MESSAGES.maxTags);
  }
  for (let i = 0; i < hashtags.length; i++) {
    const hashtag = hashtags[i];
    if (hashtagsRepeat(hashtag, hashtags.slice(i + 1))) {
      return hashtagsText.setCustomValidity(VALIDATION_MESSAGES.repeatTags);
    }
    if (regularHashtag(hashtags)) {
      return hashtagsText.setCustomValidity(VALIDATION_MESSAGES.regularTags);
    }
    if (hashtagSymbols(hashtags)) {
      return hashtagsText.setCustomValidity(VALIDATION_MESSAGES.numberTags);
    }
  }
  return hashtagsText.setCustomValidity(``);
};

const formSubmit = (evt) => {
  evt.preventDefault();
  if (hashtagValidity()) {
    form.submit();
  }
};

const cardsPicture = document.querySelector(`#picture`).content.querySelector(`a`);
const pictures = document.querySelector(`.pictures`);
const pictureFragment = document.createDocumentFragment();

const photoDescription = createPhotoDescriptionArray(25);

for (let i = 0; i < photoDescription.length; i++) {
  pictureFragment.append(renderPicture(photoDescription[i]));
}

pictures.append(pictureFragment);

const bigPicture = document.querySelector(`.big-picture`);
const commentCount = bigPicture.querySelector(`.social__comment-count`);
const commentLoader = bigPicture.querySelector(`.comments-loader`);
const socialComments = document.querySelector(`.social__comments`);

renderBigPicture(photoDescription[0]);

commentCount.classList.add(`hidden`);
commentLoader.classList.add(`hidden`);

const body = document.querySelector(`body`);
const upload = document.querySelector(`#upload-file`);
const uploadOverlay = document.querySelector(`.img-upload__overlay`);
const uploadCancel = uploadOverlay.querySelector(`#upload-cancel`);

upload.addEventListener(`change`, () => {
  openOverlay();
});

uploadCancel.addEventListener(`click`, () => {
  closeOverlay();
});

uploadCancel.addEventListener(`keydown`, (evt) => {
  if (evt.key === `Enter`) {
    closeOverlay();
  }
});

const scaleSmaller = document.querySelector(`.scale__control--smaller`);
const scaleBigger = document.querySelector(`.scale__control--bigger`);
const scaleValue = document.querySelector(`.scale__control--value`);
const form = document.querySelector(`.img-upload__form`);
const imgPreview = form.querySelector(`.img-upload__preview img`);
const filterScale = form.querySelector(`.img-upload__effect-level`);
const effectLevel = filterScale.querySelector(`.effect-level__value`);
const pin = filterScale.querySelector(`.effect-level__pin`);

scaleSmaller.addEventListener(`click`, () => {
  declineScale();
});

scaleBigger.addEventListener(`click`, () => {
  increaseScale();
});

form.addEventListener(`change`, effectChangeHandler);

pin.addEventListener(`mouseup`, effectLevelHandler);

const hashtagsText = document.querySelector(`.text__hashtags`);

hashtagsText.addEventListener(`input`, hashtagValidity);

form.addEventListener(`submit`, formSubmit);
