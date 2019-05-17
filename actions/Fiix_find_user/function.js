function(userId, ellipsis) {
  const client = ellipsis.require('ellipsis-fiix@^0.1.0-beta').sdk(ellipsis);
const util = require('util');

client.find({
  "className": "User",
  "fields": "id, strUserName, strFullName, strUserTitle, strPersonnelCode, strEmailAddress, strTelephone, strTelephone2, dv_intLocalizationID, strNotes, intUserStatusID",
  "filters": [{ "ql": "id = ?", "parameters": [parseInt(userId)] }],
  "callback": function(ret) {
    if (!ret.error) {
      ellipsis.success(util.inspect(ret.objects[0], { depth: 2 }));
    } else {
      ellipsis.error(JSON.stringify(ret.error));
    }
  }
});
}
