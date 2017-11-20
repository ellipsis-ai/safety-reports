/*
@exportId 4TRAKtU3QYKYyihnk-tN3w
*/
module.exports = (function() {
return (text, includeOther) => {
  let items = text.trim().split(/\n/).sort().map((ea, i) => {
    return { "label": ea.trim(), "id": (i + 1).toString() };
  });
  if (includeOther) {
    items = items.concat([{ label: "Other", id: "other" }]); 
  }
  return items; 
};

})()
     