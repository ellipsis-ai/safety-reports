/*
@exportId 0z-XL3K9QxqRt4WcmqSZkA
*/
module.exports = (function() {
return ellipsis => {
  const client = require('fiix-sdk')(ellipsis);

  return {
    fetchSites: fetchSites,
    fetchLocations: fetchLocations
  };
  
  function fetchSites() {
    return fetchLocations().then(locs => {
      return locs.filter(ea => ea.id == ea.intSiteID);
    })
  }

  function fetchLocations(site) {
    return new Promise((resolve, reject) => {
      const locationFilter = { "ql": "intCategoryID = ?", "parameters": [266179] };
      const filters = [locationFilter];
      if (site) {
        filters.push({ "ql": "intSiteID = ?", "parameters": [parseInt(site.id)]});
      }
      client.find({
        "className": "Asset",
        "fields": "id, strName, strDescription, intSiteID",
        "filters": filters,
        "maxObjects": 98,
        "callback": function(ret) {
          if (!ret.error) {
            if (site) {
              resolve(ret.objects.filter(ea => ea.id != ea.intSiteID));
            } else {
              resolve(ret.objects);
            }
          } else reject(ret.error);
        }
      });
    });
  }

};
})()
     