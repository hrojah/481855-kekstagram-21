'use strict';

const MIN_COORD = 0;
const MAX_COORD = 453;
const EFFECTS = {
  chrome: `effects__preview--chrome`,
  sepia: `effects__preview--sepia`,
  marvin: `effects__preview--marvin`,
  phobos: `effects__preview--phobos`,
  heat: `effects__preview--heat`,
};

const EFFECTS_ACTION = {
  'effects__preview--chrome': {
    filter: `grayscale`,
    unit: ``,
    min: 0,
    max: 1,
  },
  'effects__preview--sepia': {
    filter: `sepia`,
    unit: ``,
    min: 0,
    max: 1,
  },
  'effects__preview--marvin': {
    filter: `invert`,
    unit: `%`,
    min: 0,
    max: 100,
  },
  'effects__preview--phobos': {
    filter: `blur`,
    unit: `px`,
    min: 0,
    max: 3,
  },
  'effects__preview--heat': {
    filter: `brightness`,
    unit: ``,
    min: 1,
    max: 3,
  }
};
const imgPreview = document.querySelector(`.img-upload__preview img`);
const scaleValue = document.querySelector(`.scale__control--value`);
const filterScale = document.querySelector(`.img-upload__effect-level`);
const effectLevel = filterScale.querySelector(`.effect-level__value`);
const effectLine = filterScale.querySelector(`.effect-level__depth`);
const pin = filterScale.querySelector(`.effect-level__pin`);
const scaleSmaller = document.querySelector(`.scale__control--smaller`);
const scaleBigger = document.querySelector(`.scale__control--bigger`);

const declineScale = () => {
  const value = parseInt(scaleValue.value, 10);
  if (value > 25) {
    const valueNew = value - 25;
    scaleValue.value = valueNew + `%`;
    const valueTransform = valueNew / 100;
    imgPreview.style.transform = `scale(${valueTransform})`;
  }
};

const increaseScale = () => {
  const value = parseInt(scaleValue.value, 10);
  if (value < 100) {
    const valueNew = value + 25;
    scaleValue.value = valueNew + `%`;
    const valueTransform = valueNew / 100;
    imgPreview.style.transform = `scale(${valueTransform})`;
  }
};

const effectChangeHandler = (evt) => {
  if (evt.target.matches(`input[type='radio']`)) {
    effectLevel.value = 100;
    pin.style.left = MAX_COORD + `px`;
    effectLine.style.width = MAX_COORD + `px`;
    imgPreview.style.transform = `scale(1)`;
    scaleValue.value = 100 + `%`;
    if (evt.target.value in EFFECTS) {
      filterScale.classList.remove(`hidden`);
      imgPreview.removeAttribute(`style`);
      imgPreview.className = EFFECTS[evt.target.value];
    } else if (evt.target.value === `none`) {
      filterScale.classList.add(`hidden`);
      imgPreview.className = ``;
      imgPreview.style.filter = ``;
    }
  }
};

const getFilterValue = (value, min, max) => {
  return ((value * (max - min)) / 100) + min;
};

const getFilter = (effect, value) => {
  value = getFilterValue(value, effect.min, effect.max);
  return `${effect.filter}(${value}${effect.unit})`;
};

const effectLevelHandler = () => {
  const value = parseInt(effectLevel.value, 10);
  if (imgPreview.className in EFFECTS_ACTION) {
    imgPreview.style.filter = getFilter(EFFECTS_ACTION[imgPreview.className], value);
    return;
  }
  imgPreview.style.filter = ``;
};

pin.addEventListener(`mousedown`, (evt) => {
  evt.preventDefault();

  let startCoords = {
    x: evt.clientX,
  };

  const onMouseMove = (moveEvt) => {
    moveEvt.preventDefault();

    let shift = {
      x: startCoords.x - moveEvt.clientX,
    };

    startCoords = {
      x: moveEvt.clientX,
    };

    let coord = (pin.offsetLeft - shift.x);
    if (coord < MIN_COORD) {
      coord = MIN_COORD;
    } else if (coord > MAX_COORD) {
      coord = MAX_COORD;
    }
    pin.style.left = `${coord}px`;
    effectLine.style.width = `${coord}px`;
    effectLevel.value = coord / MAX_COORD * 100;
    effectLevelHandler();
  };

  const onMouseUp = (upEvt) => {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);
  };

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
});

pin.addEventListener(`mouseup`, effectLevelHandler);

window.effects = {
  scaleValue,
  filterScale,
  scaleSmaller,
  scaleBigger,
  imgPreview,
  declineScale,
  increaseScale,
  effectChangeHandler,
  effectLevelHandler,
};
