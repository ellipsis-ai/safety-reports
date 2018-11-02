function(site, ellipsis) {
  const locations = require('locations')(ellipsis);

locations.locationsForSite(site).then(ellipsis.success).catch(err => ellipsis.error(JSON.stringify(err)));
}
