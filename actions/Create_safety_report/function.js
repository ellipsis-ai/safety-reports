function(hazardType, briefDescription, location, stillUnsafe, concernLevel, file, details, ellipsis) {
  const box = require('ellipsis-box');
const fiixFiles = require('ellipsis-fiix').files(ellipsis);
const workOrders = require('ellipsis-fiix').workOrders(ellipsis);

const subdomain = ellipsis.env.FIIX_SUBDOMAIN;
const fiixUrl = `https://${subdomain}.macmms.com/`;
const followUpUserId = ellipsis.env.SAFETY_REPORT_FOLLOW_UP_USER_ID;
const slackUsername = ellipsis.userInfo.messageInfo.details.name;
const slackRealname = ellipsis.userInfo.messageInfo.details.profile.realName;
const stillUnsafeText = stillUnsafe ? "Yes" : "No";

uploadFile().then(fileInfo => {
  workOrders.create(description(), location).then(workOrderId => {
    createLink(fileInfo, workOrderId).then(() => {
      const workOrderUrl = `${fiixUrl}?wo=${workOrderId}`;
      const picture = fileInfo ? `[${fileInfo.filename}](${fileInfo.url})` : "<no image provided>";
      ellipsis.success({
        stillUnsafe: stillUnsafeText,
        concernLevel: concernLevel.label,
        workOrderUrl: workOrderUrl,
        fiixUrl: fiixUrl,
        hazardType: hazardType.label,
        location: location.label,
        picture: picture,
        followUpUserId: followUpUserId
      });
    });
  });
});

function createLink(fileInfo, workOrderId) {
  if (fileInfo) {
    return fiixFiles.createLink(fileInfo.filename, fileInfo.url, workOrderId);
  } else {
    return Promise.resolve(null);
  }
}

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

function uploadFile() {
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
}
