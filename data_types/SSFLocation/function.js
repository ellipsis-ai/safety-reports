function(ellipsis) {
  const locations = require('locations')(ellipsis);

locations.siteNamed("South San Francisco Location").then(site => {
  locations.locationsForSite(site).then(ellipsis.success).catch(err => ellipsis.error(JSON.stringify(err)));
});
}
