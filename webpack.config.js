const path = require('path');

module.exports = {
  entry: {
    cms: './static/viki_web_cms/js/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/viki_web_cms/distribute'),
    clean: true,
  },
  mode: "production",
};