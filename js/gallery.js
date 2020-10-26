'use strict';

(() => {
  let photoDescription;
  const cardsPicture = document.querySelector(`#picture`).content.querySelector(`a`);
  const errorModal = document.querySelector(`#error`).content.querySelector(`section`);
  const filter = document.querySelector(`.img-filters`);
  const pictures = document.querySelector(`.pictures`);

  const getPhotos = () => {
    return photoDescription;
  };

  const renderPicture = (index, photo) => {
    const pictureElement = cardsPicture.cloneNode(true);
    pictureElement.id = index;
    pictureElement.querySelector(`.picture__img`).src = photo.url;
    pictureElement.querySelector(`.picture__likes`).textContent = photo.likes;
    pictureElement.querySelector(`.picture__comments`).textContent = photo.comments.length;

    return pictureElement;
  };

  const createPictures = (photos) => {
    const pictureFragment = document.createDocumentFragment();
    for (let i = 0; i < photos.length; i++) {
      pictureFragment.append(renderPicture(i, photos[i]));
    }
    pictures.append(pictureFragment);
  };

  window.api.load((response) => {
    photoDescription = response;
    createPictures(photoDescription);
    filter.classList.remove(`img-filters--inactive`);
    window.preview.initPictureHandlers();
  }, (errorMessage) => {
    const errorWindow = errorModal.cloneNode(true);
    const errorContainer = errorWindow.querySelector(`.error__inner`);
    const errorButton = errorWindow.querySelector(`.error__button`);
    errorContainer.removeChild(errorButton);
    errorContainer.style.width = `${700}px`;
    errorWindow.querySelector(`.error__title`).textContent = errorMessage;
    window.form.main.append(errorWindow);
  });

  window.gallery = {
    pictures,
    getPhotos,
    createPictures,
  };
})();
