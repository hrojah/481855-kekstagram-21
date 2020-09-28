'use strict';

const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_AVATAR = 1;
const MAX_AVATAR = 6;

const COMMENT_TEXT = [
  'Всё отлично!',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const USER_NAMES = [
  'Антон',
  'Олег',
  'Владимир',
  'Игорь',
  'Аркадий',
  'Дмитрий',
];

const cardsPicture = document.querySelector('#picture').content.querySelector('a');
const pictures = document.querySelector('.pictures');
const pictureFragment = document.createDocumentFragment();


const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getCommentText = () => {
  return  COMMENT_TEXT[Math.floor(Math.random() * COMMENT_TEXT.length)];
}

const getUserName = () => {
  return USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)];
}

const getComment = () => {
  const comment = [];
  const commentNumber = getRandomNumber(1,5);
  for (let i = 1; i <= commentNumber; i++) {
    comment.push(
      {
        avatar: 'img/avatar-' + getRandomNumber(MIN_AVATAR, MAX_AVATAR) + '.svg',
        message: getCommentText(),
        name: getUserName()
      }
    )
  }
  return comment;
}

const createPhotoDescriptionArray = (values) => {
  const photoDescription = [];
  for (let i = 1; i <= values; i++) {
    photoDescription.push(
      {
        url: `photos/${i}.jpg`,
        description: '',
        likes : getRandomNumber(MIN_LIKES, MAX_LIKES),
        comments: getComment()
      }
    )
  }
  return photoDescription;
};

const renderPicture = (photoDescription) => {
  const pictureElement = cardsPicture.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photoDescription.url;
  pictureElement.querySelector('.picture__likes').textContent = photoDescription.likes;
  pictureElement.querySelector('.picture__comments').textContent = photoDescription.comments.length;

  return pictureElement;
}

const photoDescription = createPhotoDescriptionArray(25);

for (let i = 0; i < photoDescription.length; i++) {
  pictureFragment.append(renderPicture(photoDescription[i]));
}

pictures.append(pictureFragment);
