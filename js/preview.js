'use strict';

(() => {
  const bigPicture = document.querySelector(`.big-picture`);
  const commentCount = bigPicture.querySelector(`.social__comment-count`);
  const commentLoader = bigPicture.querySelector(`.comments-loader`);
  const socialComments = bigPicture.querySelector(`.social__comments`);
  const socialCommentText = bigPicture.querySelector(`.social__footer-text`);
  const closeBigPicture = bigPicture.querySelector(`.big-picture__cancel`);

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
    document.removeEventListener(`keydown`, window.util.onPressEsc);
  };

  const modalOpenHandler = (evt) => {
    const photos = window.getPhotos();
    for (let i = 0; i < photos.length; i++) {
      if (parseInt(evt.target.id, 10) === i) {
        renderBigPicture(photos[i]);
        bigPicture.classList.remove(`hidden`);
        document.addEventListener(`keydown`, (keydownEvent) => {
          window.util.onPressEsc(keydownEvent, closeModalOpen);
        });
      }
    }
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

  commentCount.classList.add(`hidden`);
  commentLoader.classList.add(`hidden`);

  const openPreview = () => {
    document.querySelectorAll(`.picture`).forEach((element) => {
      element.addEventListener(`click`, modalOpenHandler);
      element.addEventListener(`keydown`, (evt) => {
        window.util.onPressEnter(evt, modalOpenHandler);
      });
    });
  };

  closeBigPicture.addEventListener(`click`, closeModalOpen);

  closeBigPicture.addEventListener(`keydown`, (evt) => {
    window.util.onPressEnter(evt, closeModalOpen);
  });

  window.preview = {
    openPreview,
  };
})();
