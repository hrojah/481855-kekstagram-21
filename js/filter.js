'use strict';

(() => {
  const defaultFilterButton = document.querySelector(`#filter-default`);
  const commentsFilterButton = document.querySelector(`#filter-discussed`);
  const randomFilterButton = document.querySelector(`#filter-random`);
  const photos = window.gallery.getPhotos();
  console.log(photos);

  const defaultFilter = () => {
    window.gallery.createPicture(photos);
  };

  const countCommentsFilter = () => {
    const commentFilterPhoto = photos.slice();
    window.gallery.createPicture(commentFilterPhoto.sort((left, right) => {
      return commentFilterPhoto.comments.length(right) - commentFilterPhoto.comments.length(left);
    }));
  };

  const randomFilter = () => {
    const randomFilterPhoto = photos.slice();
    window.gallery.createPicture();
  };

  defaultFilterButton.addEventListener(`click`, defaultFilter);
  commentsFilterButton.addEventListener(`click`, countCommentsFilter);
  randomFilterButton.addEventListener(`click`, randomFilter);
})();
