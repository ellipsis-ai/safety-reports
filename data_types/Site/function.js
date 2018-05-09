function(ellipsis) {
  const locations = require('fiix-locations')(ellipsis);

locations.fetchSites().then(sites => {
  ellipsis.success(sites.map(ea => {
    return {
      label: ea.strName.trim(),
      id: ea.id
    };
  }));
});
}
