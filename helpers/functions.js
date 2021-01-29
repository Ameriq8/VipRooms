module.exports = {
  randomNumber: function(value) {
    return Math.floor(Math.random() * value);
  },

  randomNumber2: function(value, value2) {
    let value1 = Math.floor(Math.random() * value);

    return Math.floor(value1 - value1 * (value2 / 100));
  }
};
