function(searchQuery, ellipsis) {
  const locations = require('locations')(ellipsis);
const groupBy = require('group-by');
const sortBy = require('sort-by');

locations.fetchLocationsForSiteNamed(searchQuery).then(objects => {
  ellipsis.success(objects.map(ea => {
    return {
      label: ea.strName,
      id: ea.id,
      siteId: ea.intSiteID.toString()
    };
  }));
}).catch(err => ellipsis.error(JSON.stringify(err)));
}
