/*
@exportId a3AdGGvTToKZY11FTFKfmA
*/
module.exports = (function() {
const box = require('ellipsis-box');
const EllipsisApi = require('ellipsis-api');
const inspect = require('util').inspect;
const moment = require('moment-timezone');

return ellipsis => {
  const fiixFiles = require('ellipsis-fiix').files(ellipsis);
  const workOrders = require('ellipsis-fiix').workOrders(ellipsis);
  const actionsApi = new EllipsisApi(ellipsis);
  const subdomain = ellipsis.env.FIIX_SUBDOMAIN;
  const domain = ellipsis.env.FIIX_DOMAIN || "macmms";
  const fiixUrl = `https://${subdomain}.${domain}.com/`;
  const slackUsername = ellipsis.userInfo.messageInfo.details.name;
  const slackRealname = ellipsis.userInfo.messageInfo.details.profile.realName;

  return {
    createAndRespond: createAndRespond,
    create: create,
    fiixUrl: fiixUrl
  };

  function createAndRespond(department, location, description, desiredCompletion, notes) {
    const followUpUserId = ellipsis.env.WORK_REQUEST_FOLLOW_UP_USER_ID;
    const messageInfoDetails = ellipsis.userInfo.messageInfo.details;

    const requestText = `${department}: ${description}\n\n${notesText()}`
    const formattedCompletion = moment(desiredCompletion).tz(ellipsis.teamInfo.timeZone).format('dddd, D MMMM YYYY');

    const createOptions = {
      maintenanceTypeName: "Upgrade/New Install",
      description: requestText,
      location: location,
      suggestedCompletionDate: desiredCompletion
    };
    create(createOptions).then(res => {
      const workOrderUrl = `${fiixUrl}?wo=${res.workOrderId}`;
      const resultText = formatOutput({
        workOrderUrl: workOrderUrl,
        fiixUrl: fiixUrl,
        completion: formattedCompletion,
        location: location.fullName,
        followUpUserId: followUpUserId
      });
      actionsApi.say({
        channel: ellipsis.env.WORK_REQUEST_UPDATE_CHANNEL,
        message: resultText
      }).then(() => {
        ellipsis.success(resultText);
      }).catch((err) => {
        console.log(`An error occurred trying to announce the new work request to channel ${ellipsis.env.WORK_REQUEST_UPDATE_CHANNEL}:`);
        console.log(inspect(err));
        ellipsis.success(resultText);
      });
    });

    function notesText() {
      if (notes.trim().toLowerCase() === "none") {
        return "";
      } else {
        return `Additional notes:\t${notes}`;
      }
    }

    function formatOutput(successResult) {
      return `# A new work request has been created with the following information:

**Requested by:** <@${ellipsis.userInfo.messageInfo.userId}>
**Department for request:** ${department}
**Location:** ${successResult.location}
**Description:** ${description}
**Desired completion:** ${successResult.completion}
**Additional notes:** ${notes}

If you have a [Fiix](${successResult.fiixUrl}) account, you can view it at: ${successResult.workOrderUrl}

You can follow up on this by contacting <@${successResult.followUpUserId}>`;
    }
  }

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
     