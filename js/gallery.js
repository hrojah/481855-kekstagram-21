'use strict';

(() => {
  let cardsPicture;
  let photoDescription;
  const errorModal = document.querySelector(`#error`).content.querySelector(`section`);
  const main = document.querySelector(`main`);

  const renderPicture = (index, photos) => {
    const pictureElement = cardsPicture.cloneNode(true);
    pictureElement.id = index;
    pictureElement.querySelector(`.picture__img`).src = photos.url;
    pictureElement.querySelector(`.picture__likes`).textContent = photos.likes;
    pictureElement.querySelector(`.picture__comments`).textContent = photos.comments.length;

    return pictureElement;
  };

  const createPicture = (photos) => {
    cardsPicture = document.querySelector(`#picture`).content.querySelector(`a`);
    const pictures = document.querySelector(`.pictures`);
    const pictureFragment = document.createDocumentFragment();
    for (let i = 0; i < photos.length; i++) {
      pictureFragment.append(renderPicture(i, photos[i]));
    }
    pictures.append(pictureFragment);
  };

  window.load((response) => {
    photoDescription = response;
    createPicture(photoDescription);
    window.preview.initPictureHandlers();
  }, (errorMessage) => {
    const errorWindow = errorModal.cloneNode(true);
    const errorContainer = errorWindow.querySelector(`.error__inner`);
    const errorButton = errorWindow.querySelector(`.error__button`);
    errorContainer.removeChild(errorButton);
    errorContainer.style.width = 700 + `px`;
    errorWindow.querySelector(`.error__title`).textContent = errorMessage;
    main.append(errorWindow);
  });

  window.getPhotos = () => {
    return photoDescription;
  };
})();
