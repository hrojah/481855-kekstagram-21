'use strict';

(() => {
  const defaultFilterButton = document.querySelector(`#filter-default`);
  const commentsFilterButton = document.querySelector(`#filter-discussed`);
  const randomFilterButton = document.querySelector(`#filter-random`);

  const clearPhotos = () => {
    const photo = document.querySelectorAll(`.picture`);
    for (let i = 0; i < photo.length; i++) {
      const elem = photo[i];
      window.gallery.pictures.removeChild(elem);
    }
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

  const defaultFilter = window.debounce(() => {
    defaultFilterButton.classList.add(`img-filters__button--active`);
    commentsFilterButton.classList.remove(`img-filters__button--active`);
    randomFilterButton.classList.remove(`img-filters__button--active`);
    clearPhotos();
    const photos = window.gallery.getPhotos();
    window.gallery.createPictures(photos);
  });

  const getComments = (element) => {
    return element.comments.length;
  };

  const countCommentsFilter = window.debounce(() => {
    commentsFilterButton.classList.add(`img-filters__button--active`);
    randomFilterButton.classList.remove(`img-filters__button--active`);
    defaultFilterButton.classList.remove(`img-filters__button--active`);
    const photos = window.gallery.getPhotos();
    const commentFilterPhoto = photos.slice();
    clearPhotos();
    window.gallery.createPictures(commentFilterPhoto.sort((left, right) => {
      return getComments(right) - getComments(left);
    }));
  });

  const randomFilter = window.debounce(() => {
    randomFilterButton.classList.add(`img-filters__button--active`);
    commentsFilterButton.classList.remove(`img-filters__button--active`);
    defaultFilterButton.classList.remove(`img-filters__button--active`);
    const photos = window.gallery.getPhotos();
    let randomFilterPhoto = photos.slice();
    shufflePhotos(randomFilterPhoto);
    randomFilterPhoto = randomFilterPhoto.slice(0, 10);
    clearPhotos();
    window.gallery.createPictures(randomFilterPhoto);
  });

  defaultFilterButton.addEventListener(`click`, defaultFilter);
  commentsFilterButton.addEventListener(`click`, countCommentsFilter);
  randomFilterButton.addEventListener(`click`, randomFilter);
})();
