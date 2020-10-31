`use strict`;

const path = require(`path`);

module.exports = {
  entry: [
    `./js/utils.js`,
    `./js/api.js`,
    `./js/gallery.js`,
    `./js/preview.js`,
    `./js/overlay.js`,
    `./js/effects.js`,
    `./js/form.js`,
    `./js/filter.js`
    ],
  output: {
    filename: `bundle.js`,
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
