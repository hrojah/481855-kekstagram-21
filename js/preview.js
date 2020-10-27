'use strict';

(() => {
  const bigPicture = document.querySelector(`.big-picture`);
  const commentsLoader = bigPicture.querySelector(`.comments-loader`);
  const socialComments = bigPicture.querySelector(`.social__comments`);
  const socialCommentText = bigPicture.querySelector(`.social__footer-text`);
  const closeBigPicture = bigPicture.querySelector(`.big-picture__cancel`);
  const bigPictureImg = bigPicture.querySelector(`.big-picture__img img`);
  const likesCount = bigPicture.querySelector(`.likes-count`);
  const description = bigPicture.querySelector(`.social__caption`);
  const commentsCount = bigPicture.querySelector(`.comments-count`);
  let firstComments;
  let comments;

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

  const getComments = (comment, commentsContainer) => {
    firstComments = comment.splice(0, 5);
    for (let i = 0; i < firstComments.length; i++) {
      commentsContainer.appendChild(renderComment(firstComments[i]));
    }
    if (firstComments.length === 0) {
      commentsLoader.classList.add(`hidden`);
    }
  };

  const commentsLoaderClickListener = () => {
    getComments(firstComments, comments);
  };

  const closeModalOpen = () => {
    bigPicture.classList.add(`hidden`);
    socialCommentText.value = ``;
    document.removeEventListener(`keydown`, window.utils.onPressEsc);
    commentsLoader.removeEventListener(`click`, commentsLoaderClickListener);
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
    commentsLoader.addEventListener(`click`, commentsLoaderClickListener);
    commentsLoader.addEventListener(`keydown`, (keyEvt) => {
      window.utils.onPressEnter(keyEvt, commentsLoaderClickListener);
    });
  };

  const renderBigPicture = (photo) => {
    bigPictureImg.src = photo.url;
    likesCount.textContent = photo.likes;
    description.textContent = photo.description;
    commentsCount.textContent = photo.comments.length;
    comments = document.createDocumentFragment();
    const photoComments = photo.comments.slice();
    getComments(photoComments, comments);
    socialComments.innerHTML = ``;
    socialComments.append(comments);
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
})();
