function(hazardType, briefDescription, location, stillUnsafe, concernLevel, file, details, ellipsis) {
  const inspect = require('util').inspect;
const EllipsisApi = require('ellipsis-api');
const actionsApi = new EllipsisApi(ellipsis);
const workRequests = require('work-requests')(ellipsis);
const followUpUserId = ellipsis.env.SAFETY_REPORT_FOLLOW_UP_USER_ID;
const messageInfoDetails = ellipsis.userInfo.messageInfo.details;
const stillUnsafeText = stillUnsafe ? "Yes" : "No";

workRequests.create(description(), location, { file: file }).then(res => {
  const workOrderUrl = `${workRequests.fiixUrl}?wo=${res.workOrderId}`;
  const picture = res.fileInfo ? `[${res.fileInfo.filename}](${res.fileInfo.url})` : "<no image provided>";
  const resultText = formatOutput({
    stillUnsafe: stillUnsafeText,
    concernLevel: concernLevel.label,
    workOrderUrl: workOrderUrl,
    fiixUrl: workRequests.fiixUrl,
    hazardType: hazardType.label,
    location: location.label,
    picture: picture,
    followUpUserId: followUpUserId
  });
  actionsApi.say({
    channel: ellipsis.env.SAFETY_REPORT_UPDATE_CHANNEL_ID,
    message: resultText
  }).then(() => {
    ellipsis.success(resultText);
  }).catch((err) => {
    console.log("An error occurred trying to announce the new safety report to the safety-updates channel:");
    console.log(inspect(err));
    ellipsis.success(resultText);
  });
});

function additionalDetailsText() {
  if (details.trim().toLowerCase() === "none") {
    return "";
  } else {
    return `Additional details:\t${details}`;
  }
}

function description() {
  const title = `${hazardType.label}: ${briefDescription}`;
  const concernLevelText = `Level of concern:\t${concernLevel.label}`;
  return `${title}\n\nStill unsafe?:\t${stillUnsafeText}\n\n${concernLevelText}\n\n${additionalDetailsText()}`
}

function formatOutput(successResult) {
  return `# A new safety report has been created with the following information:

**Reported by:** <@${ellipsis.userInfo.messageInfo.userId}>
**Hazard type:** ${successResult.hazardType}
**Brief description:** ${briefDescription}
**Location:** ${successResult.location}
**Still unsafe?:** ${successResult.stillUnsafe}
**Level of concern:** ${successResult.concernLevel}
**Image file:** ${successResult.picture}
**Additional details:** ${details}

If you have a [Fiix](${successResult.fiixUrl}) account, you can view the report at: ${successResult.workOrderUrl}

You can follow up on this by contacting <@${successResult.followUpUserId}>`;
}
}
