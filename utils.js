var getMSB = function (nBits, number) {
  var msb = nBits;
  while((--msb >= 0) && !(number & (1 << msb)));
  return msb + 1;
};

module.exports = {getMSB: getMSB};
