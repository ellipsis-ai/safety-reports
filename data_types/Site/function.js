function(ellipsis) {
  const locations = ellipsis.require('ellipsis-fiix@beta').locations(ellipsis);

const excluded = ["(No Site)", "Asset Graveyard"];
locations.fetchSites().then(sites => {
  const filtered = sites.filter(ea => {
    return excluded.indexOf(ea.strName.trim()) === -1;
  });
  ellipsis.success(filtered.map(ea => {
    return {
      label: ea.strName.trim(),
      id: ea.id
    };
  }));
});
}
