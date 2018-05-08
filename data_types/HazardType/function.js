function(ellipsis) {
  const utils = require('data_type_utils');

const labels = utils.labelsFromText(`
No available PPE
Employee without PPE
Slip hazard
Extension cord plugged in and not attended to
Ladder hazard
Trip hazard
Falling object hazard
Moving vehicle hazard
Grow light hazard
Electrical panel hazard
Ergonomic (lifting) hazard
Fire hazard
Compressed gas hazard
Chemical hazard
Lack of warning signs
No lock out on electrical, tanks, compressed gas
Fall hazard
Sharp object hazard in work area
Evacuation path blocked
Emergency equipment out of place
`);

ellipsis.success(utils.itemsFromLabels(labels, { shouldSort: true, shouldIncludeOther: true }));
}
