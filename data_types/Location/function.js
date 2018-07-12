function(site, ellipsis) {
  const locations = require('ellipsis-fiix').locations(ellipsis);
const orderBy = require('natural-orderby').orderBy;

locations.fetchLocations(site).then(objects => {
  const processed = objects.map(ea => {
    return {
      label: ea.strName,
      id: ea.id,
      siteId: ea.intSiteID.toString()
    };
  });
  const sorted = orderBy(processed, 'label');
  ellipsis.success(sorted);
}).catch(err => ellipsis.error(JSON.stringify(err)));
}
