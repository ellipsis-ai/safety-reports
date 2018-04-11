function(ellipsis) {
  const fiixCmmsClient = require('fiix-sdk')(ellipsis);
const groupBy = require('group-by');

const findFacilities = fiixCmmsClient.prepareFind({
  "className": "Asset",
  "fields": "id, strName, strDescription, intSiteID",
  "filters": [{ "ql": "intCategoryID = ?", "parameters": [266179] }]
});

fiixCmmsClient.batch({
  "requests": [findFacilities],
  "callback": function(ret) {
    if (!ret.error) {
      const grouped = groupBySite(ret.responses[0].objects);
      ellipsis.success(grouped);
    } else ellipsis.error(ret.error);
  }
});

function groupBySite(objects) {
  const bySiteId = groupBy(objects, 'intSiteID');
  const bySite = [];
  Object.keys(bySiteId).forEach(siteId => {
    const site = objects.find(ea => ea.id == siteId);
    bySite.push({ site: site, locations: bySiteId[siteId] });
  });
  return bySite;
}
}
