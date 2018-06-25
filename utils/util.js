function convertToStarsArray(stars) {
  var num = parseInt(stars.substring(0, 1));
  var starsArr = [];
  for(var i = 1; i <= 5; i++) {
    if(num >= i) {
      starsArr.push(1)
    } else {
      starsArr.push(0)
    }
  }
  return starsArr;
}

module.exports = {
  convertToStarsArray: convertToStarsArray
}