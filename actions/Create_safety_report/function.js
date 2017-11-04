function(title, details, file, ellipsis) {
  file.fetch = require("fetch_function_for_file_param")(file, ellipsis);const request = require('request');

uploadFile().then(ref => {
  createTask(ref).then(taskId => {
    const taskUrl = `${teamworkApiBaseUrl}/#tasks/${taskId}`
    ellipsis.success(taskUrl);
  });
});

const token = ellipsis.env.TEAMWORK_API_TOKEN;
const taskListId = ellipsis.env.TEAMWORK_SAFETY_REPORT_TASK_LIST_ID;
const subdomain = ellipsis.env.TEAMWORK_SUBDOMAIN;
const credentials = "Basic " + new Buffer(`${token}:x`).toString('base64');
const teamworkApiBaseUrl = `https://${subdomain}.teamwork.com/`;
const slackUsername = ellipsis.userInfo.messageInfo.details.name;
const slackRealname = ellipsis.userInfo.messageInfo.details.profile.realName;

function teamworkApiUrlFor(path) {
  return `${teamworkApiBaseUrl}/${path}`; 
}

function uploadFile() {
  return new Promise((resolve, reject) => {
    if (file) {
      file.fetch().then(res => {
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
  const submittedText = `Submitted by: ${slackRealname} (@${slackUsername})`
  if (details.trim().toLowerCase() === "none") {
    return submittedText;
  } else {
    return `${details}\n\n${submittedText}`;
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
