'use strict';

let urls = [];

const GET_URL_NUMBER = () => {
  for (let i = 1; i <= 25; i++) {
    urls.push('photos/' + i + '.jpg');
  }
};

GET_URL_NUMBER()

const GET_URL = () => {
    const index = Math.floor(Math.random() * urls.length);
    const url = urls[index];
    urls.splice(index, 1);
    return url;
};

const GET_RANDOM_NUMBER = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const COMMENT_TEXT = [
  'Всё отлично!',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const GET_COMMENT_TEXT = COMMENT_TEXT[Math.floor(Math.random() * COMMENT_TEXT.length)];

const USER_NAMES = [
  'Антон',
  'Олег',
  'Владимир',
  'Игорь',
  'Аркадий',
  'Дмитрий',
];

const GET_USER_NAME = USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)];

const photoDescription = [];

const createPhotoDescriptionArray = (values) => {
  for (let i = 1; i <= values; i++) {
    photoDescription.push(
      {
        url: GET_URL(),
        description: '',
        likes : GET_RANDOM_NUMBER(15, 200),
        comments: [
          {avatar: 'img/avatar-' + GET_RANDOM_NUMBER(1, 6) + '.svg', message: GET_COMMENT_TEXT, name: GET_USER_NAME},
          {avatar: 'img/avatar-' + GET_RANDOM_NUMBER(1, 6) + '.svg', message: GET_COMMENT_TEXT, name: GET_USER_NAME}
        ]
      }
    )
  }
  return photoDescription;
};


createPhotoDescriptionArray(25);

const cardsPicture = document.querySelector('#picture').content.querySelector('a');
const pictures = document.querySelector('.pictures');


const renderPicture = function(photoDescription) {
  const pictureElement = cardsPicture.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photoDescription.url;
  pictureElement.querySelector('.picture__likes').textContent = photoDescription.likes;
  pictureElement.querySelector('.picture__comments').textContent = 'photoDescription.comments.length';

  return pictureElement;
}

const pictureFragment = document.createDocumentFragment();
for (let i = 0; i < photoDescription.length; i++) {
    pictureFragment.append(renderPicture[photoDescription[i]]);
}

pictures.append(pictureFragment);
