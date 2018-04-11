function(hazardType, briefDescription, location, stillUnsafe, concernLevel, file, details, ellipsis) {
  const files = require('files')(ellipsis);
const workOrders = require('work-orders')(ellipsis);
let filename;

const subdomain = ellipsis.env.FIIX_SUBDOMAIN;
const fiixUrl = `https://${subdomain}.macmms.com/`;
const workOrderUrl = fiixUrl;
const followUpUserId = ellipsis.env.SAFETY_REPORT_FOLLOW_UP_USER_ID;
const slackUsername = ellipsis.userInfo.messageInfo.details.name;
const slackRealname = ellipsis.userInfo.messageInfo.details.profile.realName;
const stillUnsafeText = stillUnsafe ? "Yes" : "No";

//uploadFile().then(fileId => {
workOrders.create(description(), location, slackRealname).then(workOrderId => {
  ellipsis.success({
    stillUnsafe: stillUnsafeText,
    concernLevel: concernLevel.label,
    workOrderUrl: workOrderUrl,
    fiixUrl: fiixUrl,
    hazardType: hazardType.label,
    location: location.label,
    filename: filename || "no image file included",
    followUpUserId: followUpUserId
  });
}).catch(err => ellipsis.error(JSON.stringify(err)));
//});

function additionalDetailsText() {
  if (details.trim().toLowerCase() === "none") {
    return "";
  } else {
    return `**Additional details:**\t${details}`;
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
      file.fetch().then(res => {
        filename = res.filename;
        files.uploadContents(filename, res.value, res.contentType).then(contentsId => {
          files.add(filename, contentsId).then(fileId => {
            resolve(fileId);
          });
        });
      });
    } else {
      resolve(null); 
    }
  });
}
}
