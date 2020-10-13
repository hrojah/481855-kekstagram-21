'use strict';

(() => {
  const bigPicture = document.querySelector(`.big-picture`);
  const commentCount = bigPicture.querySelector(`.social__comment-count`);
  const commentLoader = bigPicture.querySelector(`.comments-loader`);
  const socialComments = bigPicture.querySelector(`.social__comments`);
  const socialCommentText = bigPicture.querySelector(`.social__footer-text`);
  const closeBigPicture = bigPicture.querySelector(`.big-picture__cancel`);
  const closeModalOpen = () => {
    bigPicture.classList.add(`hidden`);
    socialCommentText.value = ``;
    document.removeEventListener(`keydown`, window.util.onPressEsc);
  };
  const modalOpenHandler = (evt) => {
    for (let i = 0; i < window.gallery.photoDescription.length; i++) {
      if (parseInt(evt.target.closest(`.picture`).hash.slice(1), 10) === window.gallery.photoDescription[i].id) {
        renderBigPicture(window.gallery.photoDescription[i]);
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
      comments.appendChild(window.mock.renderComment(photo.comments[i]));
    }
    socialComments.innerHTML = ``;
    socialComments.append(comments);
  };

  commentCount.classList.add(`hidden`);
  commentLoader.classList.add(`hidden`);

  document.querySelectorAll(`.picture`).forEach((element) => {
    element.addEventListener(`click`, modalOpenHandler);
    element.addEventListener(`keydown`, (evt) => {
      window.util.onPressEnter(evt, modalOpenHandler);
    });
  });

  closeBigPicture.addEventListener(`click`, closeModalOpen);

  closeBigPicture.addEventListener(`keydown`, (evt) => {
    window.util.onPressEnter(evt, closeModalOpen);
  });
})();
