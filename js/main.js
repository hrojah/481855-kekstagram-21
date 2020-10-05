'use strict';

const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_AVATAR = 1;
const MAX_AVATAR = 6;
const MAX_HASHTAGS = 5;
const REG = /#(?=.*[^0-9])[a-zA-Zа-яА-ЯёЁ0-9]{1,19}/i;

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
  imgPreview.className = ``;
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
    if (evt.target.value === `chrome`) {
      imgPreview.removeAttribute(`style`);
      imgPreview.className = EFFECTS[evt.target.value];
    } else if (evt.target.value === `sepia`) {
      imgPreview.removeAttribute(`style`);
      imgPreview.className = EFFECTS[evt.target.value];
    } else if (evt.target.value === `marvin`) {
      imgPreview.removeAttribute(`style`);
      imgPreview.className = EFFECTS[evt.target.value];
    } else if (evt.target.value === `phobos`) {
      imgPreview.removeAttribute(`style`);
      imgPreview.className = EFFECTS[evt.target.value];
    } else if (evt.target.value === `heat`) {
      imgPreview.removeAttribute(`style`);
      imgPreview.className = EFFECTS[evt.target.value];
    } else if (evt.target.value === `none`) {
      imgPreview.className = ``;
      imgPreview.style.remove(`filter`);
    }
  }
};

const effectLevelHandler = () => {
  const value = parseInt(effectLevel.value, 10);
  const effectLevelValue = value / 100;
  if (imgPreview.className === `effects__preview--chrome`) {
    imgPreview.style.filter = `grayscale(${effectLevelValue})`;
  } else if (imgPreview.className === `effects__preview--sepia`) {
    imgPreview.style.filter = `sepia(${effectLevelValue})`;
  } else if (imgPreview.className === `effects__preview--marvin`) {
    imgPreview.style.filter = `invert(${effectLevelValue * 100}%)`;
  } else if (imgPreview.className === `effects__preview--phobos`) {
    imgPreview.style.filter = `blur(${effectLevelValue * 3}px)`;
  } else if (imgPreview.className === `effects__preview--heat`) {
    imgPreview.style.filter = `brightness(${1 + effectLevelValue * 2})`;
  } else if (imgPreview.className === ``) {
    imgPreview.style.remove(`filter`);
  }
};


const hashtagsNumber = (hashtaglist) => {
  return hashtaglist.length > MAX_HASHTAGS;
};

const hashtagsRepeat = (hashtaglist) => {
  for (let i = 0; i < hashtaglist.length; i++) {
    for (let j = i + 1; j < hashtaglist.length; j++) {
      if (hashtaglist[i] === hashtaglist[j]) {
        return true;
      }
    }
  }
  return false;
};

const regularhashtag = (hashtaglist) => {
  for (let i = 0; i < hashtaglist.length; i++) {
    if (!REG.test(hashtaglist[i])) {
      return true;
    }
  }
  return false;
};

const hashtagValidity = () => {
  const hashtags = hashtagsText.value.toLowerCase().trim().split(` `);
  if (hashtagsNumber(hashtags)) {
    hashtagsText.setCustomValidity(`не больше 5 хэштегов`);
  } else if (hashtagsRepeat(hashtags)) {
    hashtagsText.setCustomValidity(`хэштеги не должны повторяться`);
  } else if (regularhashtag(hashtags)) {
    hashtagsText.setCustomValidity(`недопустимые символы`);
  } else {
    hashtagsText.setCustomValidity(``);
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

/*bigPicture.classList.remove(`hidden`);*/

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
const imgPreview = document.querySelector(`.img-upload__preview img`);
const form = document.querySelector(`.img-upload__form`);
const effectLevel = document.querySelector(`.effect-level__value`);
const pin = document.querySelector(`.effect-level__pin`);

scaleSmaller.addEventListener(`click`, () => {
  declineScale();
});

scaleBigger.addEventListener(`click`, () => {
  increaseScale();
});

form.addEventListener(`change`, effectChangeHandler);

pin.addEventListener(`mouseup`, effectLevelHandler);

const hashtagsText = document.querySelector(`.text__hashtags`);

hashtagsText.addEventListener(`input`, () => {
  hashtagValidity();
});
