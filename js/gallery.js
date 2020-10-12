'use strict';

(() => {
  const createPhotoDescriptionArray = (values) => {
    const photoDescription = [];
    for (let i = 1; i <= values; i++) {
      photoDescription.push({
        id: i,
        url: `photos/${i}.jpg`,
        description: ``,
        likes: window.mock.getRandomNumber(window.mock.MIN_LIKES, window.mock.MAX_LIKES),
        comments: window.mock.getComments(window.mock.getRandomNumber(1, 5))
      });
    }
    return photoDescription;
  };

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

  const photoDescription = createPhotoDescriptionArray(25);

  for (let i = 0; i < photoDescription.length; i++) {
    pictureFragment.append(renderPicture(photoDescription[i]));
  }

  pictures.append(pictureFragment);
  window.gallery = {
    photoDescription,
  };
})();
