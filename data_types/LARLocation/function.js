function(ellipsis) {
  const locations = require('locations')(ellipsis);

locations.siteNamed("Laramie Location").then(site => {
  locations.locationsForSite(site).then(ellipsis.success).catch(err => ellipsis.error(JSON.stringify(err)));
});
}
