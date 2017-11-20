/*
@exportId 4TRAKtU3QYKYyihnk-tN3w
*/
module.exports = (function() {
return (text, optionalOptions) => {
  const options = optionalOptions || {};
  let labels = text.trim().split(/\n/).map(ea => ea.trim());
  if (options.shouldSort) {
    labels = labels.sort();
  }
  let items = labels.map((ea, i) => {
    return { "label": ea, "id": (i + 1).toString() };
  });
  if (options.shouldIncludeOther) {
    items = items.concat([{ label: "Other", id: "other" }]); 
  }
  return items; 
};

})()
     