/*
@exportId 4TRAKtU3QYKYyihnk-tN3w
*/
module.exports = (function() {
return {
  labelsFromText: labelsFromText,
  itemsFromLabels: itemsFromLabels
};

function labelsFromText(text) {
  return text.trim().split(/\n/).map(ea => ea.trim())
}

function itemsFromLabels(labels, optionalOptions) {
  const options = optionalOptions || {};
  const labelsToUse = options.shouldSort ? labels.sort() : labels;
  let items = labelsToUse.map((ea, i) => {
    return { "label": ea, "id": (i + 1).toString() };
  });
  if (options.shouldIncludeOther) {
    items = items.concat([{ label: "Other", id: "other" }]); 
  }
  return items; 
}

})()
     