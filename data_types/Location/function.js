function(ellipsis) {
  const utils = require('data_type_utils');

const sfLocations = `
Condor 1
Condor 2
Condor packaging
Mkt test room
MAP - Farm ops room
MAP - Hallway
MAP - Tank room
MAP - Cold storage
Propagation room
Seeder area
R&D area
Open warehouse
Old trailer
New trailer
New office 1st floor
New office 2nd floor
Truck dock
Outside trailer area
`;

const laramieLocations = `
Office
Warehouse
Mezzanine
`;

const seattleLocations = `
Office
Receiving 1
Receiving 2
Packaging line
Wash line
Cold storage
Grow (DGS)
Grow (ZIP)
Sanitation
`;

const sfLabels = utils.labelsFromText(sfLocations).map(ea => `SF - ${ea}`);
const laramieLabels = utils.labelsFromText(laramieLocations).map(ea => `Laramie - ${ea}`);
const seattleLabels = utils.labelsFromText(seattleLocations).map(ea => `Seattle – ${ea}`);
const labels = sfLabels.concat(laramieLabels).concat(seattleLabels);

ellipsis.success(utils.itemsFromLabels(labels, { shouldSort: true, shouldIncludeOther: true }));
}
