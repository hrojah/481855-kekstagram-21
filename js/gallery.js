'use strict';

(() => {

  const renderPicture = (photoDescription) => {
    const pictureElement = cardsPicture.cloneNode(true);
    pictureElement.href = `#` + photoDescription.id;
    pictureElement.querySelector(`.picture__img`).src = photoDescription.url;
    pictureElement.querySelector(`.picture__likes`).textContent = photoDescription.likes;
    pictureElement.querySelector(`.picture__comments`).textContent = photoDescription.comments.length;

    return pictureElement;
  };

  const cardsPicture = document.querySelector(`#picture`).content.querySelector(`a`);
  const pictures = document.querySelector(`.pictures`);
  const pictureFragment = document.createDocumentFragment();

  const createPicture = (photos) => {
    for (let i = 0; i < photos.length; i++) {
      pictureFragment.append(renderPicture(photos[i]));
    }
    pictures.append(pictureFragment);
  };

  const photoDescription = window.mock.createPhotoDescriptionArray(25);

  createPicture(photoDescription);

  window.gallery = {
    photoDescription,
  };
})();
