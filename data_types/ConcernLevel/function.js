function(ellipsis) {
  const utils = require('data_type_utils');

const labels = utils.labelsFromText(`
Not concerned
Slightly concerned
Moderately concerned
Quite concerned
Extremely concerned
`);

ellipsis.success(utils.itemsFromLabels(labels));
}
