'use strict';

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

const closeModalOpen = () => {
  bigPicture.classList.add(`hidden`);
  socialCommentText.value = ``;
  socialComments.innerHTML = ``;
  commentsLoader.classList.remove(`hidden`);
  document.removeEventListener(`keydown`, window.utils.onPressEsc);
  commentsLoader.removeEventListener(`click`, getComments);
  commentsLoader.removeEventListener(`keydown`, window.utils.onPressEnter);
};

const modalOpenHandler = (evt) => {
  const photos = window.gallery.getPhotos();
  const index = parseInt(evt.target.closest(`.picture`).id, 10);
  renderBigPicture(photos[index]);
  bigPicture.classList.remove(`hidden`);
  document.addEventListener(`keydown`, (keydownEvent) => {
    window.utils.onPressEsc(keydownEvent, closeModalOpen);
  });
  commentsLoader.addEventListener(`click`, getComments);
  commentsLoader.addEventListener(`keydown`, (keyEvt) => {
    window.utils.onPressEnter(keyEvt, getComments);
  });
};

const getComments = () => {
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
  getComments(photo.comments);
};

const initPictureHandlers = () => {
  document.querySelectorAll(`.picture`).forEach((element) => {
    element.addEventListener(`click`, modalOpenHandler);
    element.addEventListener(`keydown`, (evt) => {
      window.utils.onPressEnter(evt, modalOpenHandler);
    });
  });
};

closeBigPicture.addEventListener(`click`, closeModalOpen);

closeBigPicture.addEventListener(`keydown`, (evt) => {
  window.utils.onPressEnter(evt, closeModalOpen);
});

window.preview = {
  initPictureHandlers,
};
