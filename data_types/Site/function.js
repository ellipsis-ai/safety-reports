function(ellipsis) {
  const locations = require('locations')(ellipsis);

locations.fetchSites().then(sites => {
  ellipsis.success(sites.map(ea => {
    return {
      label: ea.strName.trim(),
      id: ea.id
    };
  }));
});
}
