/*
@exportId ySqxrno3RR2Mm6KJ5CZzFA
*/
module.exports = (function() {
const BoxSDK = require('box-node-sdk');

return ellipsis => {
  const configJSON = JSON.parse(ellipsis.env.BOX_CONFIG);
  const sdk = BoxSDK.getPreconfiguredInstance(configJSON);
  return sdk.getAppAuthClient('enterprise', ellipsis.env.BOX_APP_ENTERPRISE_ID);
}

})()
     