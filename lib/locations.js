/*
@exportId 3zo3L0P5QGKRmx2egFoAkg
*/
module.exports = (function() {
const orderBy = require('natural-orderby').orderBy;

return ellipsis => {
  const locations = require('ellipsis-fiix').locations(ellipsis);

  return {
    allSites: allSites,
    ssfSite: ssfSite,
    locationsForSite: locationsForSite
  };

  function allSites() {
    return locations.fetchSites();
  }

  function ssfSite() {
    return new Promise((resolve, reject) => {
      allSites().then(sites => {
        const ssf = sites.find(ea => ea.strName.trim() === "South San Francisco Location");
        resolve(ssf ? { label: ssf.strName.trim(), id: ssf.id } : undefined);
      });
    });
  }

  function locationsForSite(site) {
    return new Promise((resolve, reject) => {
      locations.fetchLocations(site).then(objects => {
        const processed = objects.map(ea => {
          return {
            label: ea.strName,
            id: ea.id,
            siteId: ea.intSiteID.toString(),
            fullName: `${site.label} – ${ea.strName}`
          };
        });
        const sorted = orderBy(processed, 'label');
        resolve(sorted);
      });
    });
  }

};

})()
     