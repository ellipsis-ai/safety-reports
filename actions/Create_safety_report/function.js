function(title, hazardType, location, file, details, ellipsis) {
  const request = require('request');

const token = ellipsis.env.TEAMWORK_API_TOKEN;
const taskListId = ellipsis.env.TEAMWORK_SAFETY_REPORT_TASK_LIST_ID;
const subdomain = ellipsis.env.TEAMWORK_SUBDOMAIN;
const followUpUserId = ellipsis.env.SAFETY_REPORT_FOLLOW_UP_USER_ID;
const credentials = "Basic " + new Buffer(`${token}:x`).toString('base64');
const teamworkApiBaseUrl = `https://${subdomain}.teamwork.com`;
const slackUsername = ellipsis.userInfo.messageInfo.details.name;
const slackRealname = ellipsis.userInfo.messageInfo.details.profile.realName;
let filename = null;

uploadFile().then(ref => {
  createTask(ref).then(taskId => {
    const taskUrl = `${teamworkApiBaseUrl}/#tasks/${taskId}`
    ellipsis.success({
      taskUrl: taskUrl,
      teamworkUrl: teamworkApiBaseUrl,
      hazardType: hazardType.label,
      location: location.label,
      filename: filename || "no image file included",
      followUpUserId: followUpUserId
    });
  });
});

function teamworkApiUrlFor(path) {
  return `${teamworkApiBaseUrl}/${path}`; 
}

function uploadFile() {
  return new Promise((resolve, reject) => {
    if (file) {
      file.fetch().then(res => {
        filename = res.filename;
        const formData = {
          file: {
            value: res.value,
            options: {
              filename: res.filename,
              contentType: res.contentType
            }
          }
        }; 
        request.post({ 
          url: teamworkApiUrlFor("pendingfiles.json"), 
          formData: formData, 
          headers: { "Authorization": credentials }
        }, (err, response, body) => {
          if (response.statusCode === 201) {
            resolve(JSON.parse(response.body).pendingFile.ref);
          } else {
            reject(err);     
          }
        });
      });
    } else {
      resolve(null); 
    }
  });
}

function description() {
  const submittedText =  `**Submitted by:**\t${slackRealname} (@${slackUsername})`;
  const hazardTypeText = `**Hazard type:**\t${hazardType.label}`;
  const locationText = `**Location:**\t${location.label}`;
  const standardText = `${submittedText}\n\n${hazardTypeText}\n\n${locationText}`;
  if (details.trim().toLowerCase() === "none") {
    return standardText;
  } else {
    return `${details}\n\n${standardText}`;
  }
}

function createTask(pendingFileRef) {
  return new Promise((resolve, reject) => {
    const body = {
      "todo-item": {
        content: title,
        description: description(),
        pendingFileAttachments: pendingFileRef
      }
    }; 
    request.post({ 
      url: teamworkApiUrlFor(`/tasklists/${taskListId}/tasks.json`), 
      body: body, 
      json: true,
      headers: { "Authorization": credentials }
    }, (err, response, body) => {
      if (response.statusCode === 201) {
        resolve(response.body.id);
      } else {
        reject(err);     
      }
    });
  });
}
}
