module.exports = class Illust {
  constructor({
    title, source, ext, medium, large,
  }) {
    this.title = title;
    this.source = source;
    this.ext = ext;
    this.images = {
      large,
      medium,
    };
  }
};
