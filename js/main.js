'use strict';

let urls = [];

const getUrlNumber = () => {
  for (let i = 1; i <= 25; i++) {
    urls.push('photos/' + i + '.jpg');
  }
};

getUrlNumber()

const getUrl = () => {
    const INDEX = Math.floor(Math.random() * urls.length);
    const url = urls[INDEX];
    urls.splice(INDEX, 1);
    return url;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const COMMENT_TEXT = [
  'Всё отлично!',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const getCommentText = () => {
    return  COMMENT_TEXT[Math.floor(Math.random() * COMMENT_TEXT.length)];
}

const USER_NAMES = [
  'Антон',
  'Олег',
  'Владимир',
  'Игорь',
  'Аркадий',
  'Дмитрий',
];

const getUserName = () => {
    return USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)];
}

const photoDescription = [];

const createPhotoDescriptionArray = (values) => {
  for (let i = 1; i <= values; i++) {
    photoDescription.push(
      {
        url: getUrl(),
        description: '',
        likes : getRandomNumber(15, 200),
        comments: [
          {avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg', message: getCommentText, name: getUserName},
          {avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg', message: getCommentText, name: getUserName}
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
  pictureElement.querySelector('.picture__comments').textContent = photoDescription.comments.length;

  return pictureElement;
}

const pictureFragment = document.createDocumentFragment();
for (let i = 0; i < photoDescription.length; i++) {
    pictureFragment.append(renderPicture(photoDescription[i]));
}

pictures.append(pictureFragment);
