'use strict';

(() => {
  const defaultFilterButton = document.querySelector(`#filter-default`);
  const commentsFilterButton = document.querySelector(`#filter-discussed`);
  const randomFilterButton = document.querySelector(`#filter-random`);
  const filters = document.querySelector(`.img-filters`);

  const selectFilter = (buttonElement) => {
    filters.querySelectorAll(`.img-filters__button--active`).forEach((element) => {
      element.classList.remove(`img-filters__button--active`);
    });
    buttonElement.classList.add(`img-filters__button--active`);
  };

  const clearPhotos = () => {
    window.gallery.pictures.classList.add(`hidden`);
    const photos = document.querySelectorAll(`.picture`);
    for (let i = 0; i < photos.length; i++) {
      photos[i].remove();
    }
    window.gallery.pictures.classList.remove(`hidden`);
  };

  const shufflePhotos = (photos) => {
    for (let i = photos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const element = photos[j];
      photos[j] = photos[i];
      photos[i] = element;
    }
    return photos;
  };

  const getDefaultPhotos = () => {
    selectFilter(defaultFilterButton);
    clearPhotos();
    window.gallery.createPictures(window.gallery.getPhotos());
  };

  const getCountCommentsPhotos = () => {
    selectFilter(commentsFilterButton);
    const photos = window.gallery.getPhotos();
    const commentFilterPhoto = photos.slice();
    clearPhotos();
    window.gallery.createPictures(commentFilterPhoto.sort((left, right) => {
      return right.comments.length - left.comments.length;
    }));
  };

  const getRandomPhotos = () => {
    selectFilter(randomFilterButton);
    const photos = window.gallery.getPhotos();
    let randomFilterPhoto = photos.slice();
    shufflePhotos(randomFilterPhoto);
    randomFilterPhoto = randomFilterPhoto.slice(0, 10);
    clearPhotos();
    window.gallery.createPictures(randomFilterPhoto);
  };

  const defaultFilter = window.utils.debounce(getDefaultPhotos);
  const countCommentsFilter = window.utils.debounce(getCountCommentsPhotos);
  const randomFilter = window.utils.debounce(getRandomPhotos);

  defaultFilterButton.addEventListener(`click`, defaultFilter);
  commentsFilterButton.addEventListener(`click`, countCommentsFilter);
  randomFilterButton.addEventListener(`click`, randomFilter);
})();
