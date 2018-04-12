/*
@exportId qbBJPEhmQGCohwPcGiMqHg
*/
module.exports = (function() {
const request = require('request');

return ellipsis => {
  const client = require('fiix-sdk')(ellipsis);

  return {
    create: create,
    upload: upload
  };
  
  function create(filename, contents, mimeType, workOrderId) {
    return new Promise((resolve, reject) => {
      uploadContents(filename, contents, mimeType).then(contentsId => {
        createFile(filename, contentsId, workOrderId).then(fileId => {
          resolve(fileId);
        });
      });
    });
  }
  
  function createFile(filename, contentsId, workOrderId) {
    return new Promise((resolve, reject) => {
      client.add({
        "className" : "File",
        "fields": "id",
        "object" : {
          "intWorkOrderID" : parseInt(workOrderId),
          "strName" : filename,
          "intFileContentsID" : contentsId
        },
        "callback": function(ret) {
          if (!ret.error) {
            resolve(ret.object.id);
          } else reject(JSON.stringify(ret.error));
        }
      });
    });
  }
  
  function upload(file) {
    return new Promise((resolve, reject) => {
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
          url: client.calcFileUploadURI(), 
          formData: formData
        }, (err, response, body) => {
          if (response.statusCode === 201) {
            resolve(JSON.parse(response.body));
          } else {
            reject([err, response.statusCode, response.body]);     
          }
        });
      });
    });
  }

  function uploadContents(filename, contents, mimeType) {
    return new Promise((resolve, reject) => {
      client.add({
        "className" : "FileContents",
        "fields": "id",
        "object" : {
          "intIsShared" : 1,
          "strName" : filename,
          "strContents" : contents,
          "strMimeType" : mimeType
        },
        "callback": function(ret) {
          if (!ret.error) {
            resolve(ret.object.id);
          } else reject(JSON.stringify(ret.error));
        }
      });
    });
  }

};



})()
     