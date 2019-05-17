/*
@exportId a3AdGGvTToKZY11FTFKfmA
*/
module.exports = (function() {
const box = require('ellipsis-box');
const EllipsisApi = require('ellipsis-api');
const inspect = require('util').inspect;
const moment = require('moment-timezone');

return (ellipsis) => {
  const ellipsisFiix = ellipsis.require('ellipsis-fiix@^0.1.0');
  const fiixFiles = ellipsisFiix.files(ellipsis);
  const workOrders = require('ellipsis-fiix').workOrders(ellipsis);
  const sdk = ellipsisFiix.sdk(ellipsis);
  const actionsApi = new EllipsisApi(ellipsis);
  const subdomain = ellipsis.env.FIIX_SUBDOMAIN;
  const domain = ellipsis.env.FIIX_DOMAIN || "macmms";
  const fiixUrl = `https://${subdomain}.${domain}.com/`;

  return {
    createAndRespond: createAndRespond,
    create: create,
    fiixUrl: fiixUrl,
    client: sdk
  };

  function desiredCompletionFor(urgency) {
    const endOfWorkday = when => when.startOf('day').add(17, 'hours');
    const tz = ellipsis.teamInfo.timeZone;
    if (urgency === 'urgent') {
      return moment().tz(tz).add(24, 'hours');
    } else if (urgency === 'high') {
      return endOfWorkday(moment().tz(tz).add(3, 'days'));
    } else if (urgency === 'normal') {
      return endOfWorkday(moment().tz(tz).add(5, 'days'));
    } else if (urgency === 'low' || true) {
      return endOfWorkday(moment().tz(tz).add(10, 'days'));
    }
  }

  function createAndRespond(department, location, description, urgency, notes, followUpUserId, updateChannel) {
    const messageInfoDetails = ellipsis.userInfo.messageInfo.details;

    const requestText = `${department}: ${description}\n\n${notesText()}`

    const desiredCompletion = desiredCompletionFor(urgency.id);    
    const formattedCompletion = moment(desiredCompletion).tz(ellipsis.teamInfo.timeZone).format('dddd, D MMMM YYYY h:mm a');

    const createOptions = {
      maintenanceTypeName: "Upgrade/New Install",
      description: requestText,
      location: location,
      suggestedCompletionDate: desiredCompletion,
      priority: urgency.fiixLabel
    };
    create(createOptions).then(res => {
      const workOrderUrl = `${fiixUrl}?wo=${res.workOrderId}`;
      const resultText = formatOutput({
        workOrderUrl: workOrderUrl,
        fiixUrl: fiixUrl,
        priority: urgency.fiixLabel,
        completion: formattedCompletion,
        location: location.fullName,
        followUpUserId: followUpUserId
      });
      updateChannelIfNec(resultText, updateChannel).then(() => {
        ellipsis.success(resultText);
      }).catch((err) => {
        console.log(`An error occurred trying to announce the new work request to channel ${updateChannel}:`);
        console.log(inspect(err));
        ellipsis.success(resultText);
      });
    });

    function updateChannelIfNec(resultText, updateChannel) {
      if (ellipsis.userInfo.messageInfo.details.channelName === updateChannel) {
        return Promise.resolve();
      } else {
        return actionsApi.say({
          channel: updateChannel,
          message: resultText
        });
      }
    }

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
**Priority:** ${successResult.priority}
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
     