'use strict';

(() => {
  const MIN_LIKES = 15;
  const MAX_LIKES = 200;
  const MIN_AVATAR = 1;
  const MAX_AVATAR = 6;
  const MIN_COMMENT = 1;
  const MAX_COMMENT = 5;

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
        id: i,
        url: `photos/${i}.jpg`,
        description: ``,
        likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
        comments: getComments(getRandomNumber(MIN_COMMENT, MAX_COMMENT))
      });
    }
    return photoDescription;
  };

  window.mock = {
    createPhotoDescriptionArray,
  };
})();
