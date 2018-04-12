function(ellipsis) {
  const locations = require('locations')(ellipsis);

locations.fetchSites().then(sites => {
  ellipsis.success(sites.length);
})
}
