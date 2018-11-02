/*
@exportId a3AdGGvTToKZY11FTFKfmA
*/
module.exports = (function() {
const box = require('ellipsis-box');
const EllipsisApi = require('ellipsis-api');
const inspect = require('util').inspect;

return ellipsis => {
  const fiixFiles = require('ellipsis-fiix').files(ellipsis);
  const workOrders = require('ellipsis-fiix').workOrders(ellipsis);
  const actionsApi = new EllipsisApi(ellipsis);
  const subdomain = ellipsis.env.FIIX_SUBDOMAIN;
  const fiixUrl = `https://${subdomain}.macmms.com/`;
  const slackUsername = ellipsis.userInfo.messageInfo.details.name;
  const slackRealname = ellipsis.userInfo.messageInfo.details.profile.realName;

  return {
    create: create,
    fiixUrl: fiixUrl
  };

  function create(options) {
    return new Promise((resolve, reject) => {
      uploadFile(options.file).then(fileInfo => {
        workOrders.create(options).then(workOrderId => {
          createLink(fileInfo, workOrderId).then(() => {
            resolve({
              workOrderId: workOrderId, 
              fileInfo: fileInfo
            });
          });
        });
      });
    });
  }

  function createLink(fileInfo, workOrderId) {
    if (fileInfo) {
      return fiixFiles.createLink(fileInfo.filename, fileInfo.url, workOrderId);
    } else {
      return Promise.resolve(null);
    }
  }

  function uploadFile(file) {
    return new Promise((resolve, reject) => {
      if (file) {
        file.fetch().then(fetchResult => {
          box.files(ellipsis).uploadWithTimestamp(fetchResult.filename, fetchResult.contentType, fetchResult.value).then(uploadResult => {
            resolve({ url: uploadResult.url, filename: fetchResult.filename });
          })
        });
      } else {
        resolve(null); 
      }
    });
  }

};

})()
     