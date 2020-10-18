'use strict';

(() => {

  const renderPicture = (index, photoDescription) => {
    const pictureElement = cardsPicture.cloneNode(true);
    pictureElement.id = index;
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
      pictureFragment.append(renderPicture(i, photos[i]));
    }
    pictures.append(pictureFragment);
  };

  window.load((response) => {
    photoDescription = response;
    createPicture(photoDescription);
    window.preview.openPreview();
  });

  window.getPhotos = () => {
    return photoDescription;
  };
})();
