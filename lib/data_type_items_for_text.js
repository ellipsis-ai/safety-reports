/*
@exportId 4TRAKtU3QYKYyihnk-tN3w
*/
module.exports = (function() {
return text => text.trim().split(/\n/).map((ea, i) => {
  return { "label": ea.trim(), "id": (i + 1).toString() };
});

})()
     