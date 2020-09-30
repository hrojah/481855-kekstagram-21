'use strict';

const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_AVATAR = 1;
const MAX_AVATAR = 6;

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
  element.appendChild(commentImg);
  element.appendChild(commentText);
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

bigPicture.classList.remove(`hidden`);
