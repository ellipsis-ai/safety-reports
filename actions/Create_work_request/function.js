function(department, location, description, desiredCompletion, notes, ellipsis) {
  const moment = require('moment-timezone');
const inspect = require('util').inspect;
const EllipsisApi = require('ellipsis-api');
const actionsApi = new EllipsisApi(ellipsis);
const workRequests = require('work-requests')(ellipsis);
const followUpUserId = ellipsis.env.WORK_REQUEST_FOLLOW_UP_USER_ID;
const messageInfoDetails = ellipsis.userInfo.messageInfo.details;

const requestText = `${department}: ${description}\n\n${notesText()}`
const formattedCompletion = moment(desiredCompletion).tz(ellipsis.teamInfo.timeZone).format('dddd, D MMMM YYYY');
workRequests.create(requestText, location, { suggestedCompletionDate: desiredCompletion }).then(res => {
  const workOrderUrl = `${workRequests.fiixUrl}?wo=${res.workOrderId}`;
  const resultText = formatOutput({
    workOrderUrl: workOrderUrl,
    fiixUrl: workRequests.fiixUrl,
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
