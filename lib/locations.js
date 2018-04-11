/*
@exportId 0z-XL3K9QxqRt4WcmqSZkA
*/
module.exports = (function() {
return ellipsis => {
  const client = require('fiix-sdk')(ellipsis);

  return {
    fetchSites: () => fetchSites(client),
    fetchLocationsForSiteNamed: siteName => fetchLocations(client, siteName)
  };

};

function fetchSites(client) {
  return fetchLocations(client).then(locs => {
    return locs.filter(ea => ea.id == ea.intSiteID);
  })
}

function siteIdFor(client, siteName) {
  return new Promise((resolve, reject) => {
    if (siteName) {
      fetchSites(client).then(sites => {
        const site = sites.find(ea => ea.strName.trim() == siteName.trim());
        resolve(site ? site.id : undefined);
      })
    } else {
      resolve(undefined);
    }
  });
}

function fetchLocations(client, siteName) {
  return new Promise((resolve, reject) => {
    siteIdFor(client, siteName).then(siteId => {
      const locationFilter = { "ql": "intCategoryID = ?", "parameters": [266179] };
      const filters = [locationFilter];
      if (siteId) {
        filters.push({ "ql": "intSiteID = ?", "parameters": [parseInt(siteId)]});
      }
      client.find({
        "className": "Asset",
        "fields": "id, strName, strDescription, intSiteID",
        "filters": filters,
        "maxObjects": 98,
        "callback": function(ret) {
          if (!ret.error) {
            if (siteId) {
              resolve(ret.objects.filter(ea => ea.id != ea.intSiteID));
            } else {
              resolve(ret.objects);
            }
          } else reject(ret.error);
        }
      });
    });
  });
}
})()
     