function(ellipsis) {
  const locations = require('locations')(ellipsis);

locations.ssfSite().then(site => {
  locations.locationsForSite(site).then(ellipsis.success).catch(err => ellipsis.error(JSON.stringify(err)));
});
}
