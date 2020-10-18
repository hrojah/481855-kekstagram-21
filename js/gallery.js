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

  let photoDescription;

  let cardsPicture;

  const createPicture = (photos) => {
    cardsPicture = document.querySelector(`#picture`).content.querySelector(`a`);
    const pictures = document.querySelector(`.pictures`);
    const pictureFragment = document.createDocumentFragment();
    for (let i = 0; i < photos.length; i++) {
      pictureFragment.append(renderPicture(photos[i]));
    }
    pictures.append(pictureFragment);
  };

  window.load((response) => {
    photoDescription = response;

    createPicture(photoDescription);
  });

  window.gallery = {
    photoDescription,
  };
})();
