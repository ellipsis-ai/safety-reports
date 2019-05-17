/*
@exportId 3zo3L0P5QGKRmx2egFoAkg
*/
module.exports = (function() {
const orderBy = require('natural-orderby').orderBy;

return (ellipsis) => {
  const locations = ellipsis.require('ellipsis-fiix@^0.1.0-beta').locations(ellipsis);

  return {
    allSites: allSites,
    siteNamed: siteNamed,
    locationsForSite: locationsForSite
  };

  function allSites() {
    return locations.fetchSites();
  }

  function siteNamed(name) {
    return new Promise((resolve, reject) => {
      allSites().then(sites => {
        const ssf = sites.find(ea => ea.strName.trim() === name);
        resolve(ssf ? { label: ssf.strName.trim(), id: ssf.id } : undefined);
      });
    });
  }

  function ssfSite() {
    return siteNamed("South San Francisco Location");
  }

  function laramieSite() {
    return siteNamed("Laramie Location");
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
     