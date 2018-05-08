/*
@exportId qbBJPEhmQGCohwPcGiMqHg
*/
module.exports = (function() {
// const request = require('request').defaults({ encoding: null });
// const streamToBuffer = require('stream-to-buffer') 

 
return ellipsis => {
  const client = require('fiix-sdk')(ellipsis);

  return {
//    create: create,
    createLink: createLink,
//     upload: upload
  };
  
//   function create(file, workOrderId) {
//     return new Promise((resolve, reject) => {
//       upload(file).then(res => {
//         createFile(res.filename, res.contentsId, workOrderId).then(fileId => {
//           resolve(fileId);
//         });
//       });
//     });
//   }
  
//   function createFile(filename, contentsId, workOrderId) {
//     return new Promise((resolve, reject) => {
//       client.add({
//         "className" : "File",
//         "fields": "id",
//         "object" : {
//           "intWorkOrderID" : parseInt(workOrderId),
//           "strName" : filename,
//           "intFileContentsID" : contentsId,
//           "intFileTypeID" : 1
//         },
//         "callback": function(ret) {
//           if (!ret.error) {
//             resolve(ret.object.id);
//           } else reject(JSON.stringify(ret.error));
//         }
//       });
//     });
//   }
  
  function createLink(filename, link, workOrderId) {
    return new Promise((resolve, reject) => {
      client.add({
        "className" : "File",
        "fields": "id",
        "object" : {
          "intWorkOrderID" : parseInt(workOrderId.toString()),
          "intFileTypeID" : 1,
          "strName" : filename,
          "strLink" : link
        },
        "callback": function(ret) {
          if (!ret.error) {
            resolve(ret.object.id);
          } else reject(JSON.stringify(ret.error));
        }
      });
    });
  }
  
//   function upload(file) {
//     return new Promise((resolve, reject) => {
//       file.fetch().then(res => {
//         const formData = {
// //           "className" : "FileContents",
// //           "fields": "id",
// //           "object[intIsShared]": "1",
// //           "object[strName]": encodeURIComponent(res.filename),
// //           "object[strMimeType]" : encodeURIComponent(res.contentType),
//           file: {
//             value: res.value,
//             options: {
//               filename: res.filename,
//               contentType: res.contentType
//             }
//           }
//         };
//         const url = client.calcFileUploadURI();
//         const formData = {
//           file: {
//             value: res.value,
//             options: {
//               filename: res.filename,
//               contentType: res.contentType
//             }
//           }
//         }; 
//         request.post({ 
//           url: url, 
//           formData: formData
//         }, (err, response, body) => {
//           if (response.statusCode === 201 || response.statusCode === 200) {
//             resolve(response.body);
//           } else {
//             reject(JSON.stringify({ err: err, status: response.statusCode, body: response.body.toString() }));     
//           }
//         });
//         res.value.pipe(request.post(url, (err, response, body) => {
//           if (response.statusCode === 201) {
//             resolve(JSON.parse(response.body));
//           } else {
//             reject([err, response.statusCode, response.body]);     
//           }
//         }));
//         const query = queryString.parseUrl(url).query;
//         const sig = queryString.parse(query).sig;
//         request.post({ 
//           url: client.calcFileUploadURI(), 
//           formData: formData,
//           headers: { "Authorization": sig }
//         }, (err, response, body) => {
//           if (response.statusCode === 201) {
//             resolve(JSON.parse(response.body));
//           } else {
//             reject([err, response.statusCode, response.body]);     
//           }
//         });
//       });
//     });
//   }
  
//   function upload(file) {
//     return new Promise((resolve, reject) => {
//       file.fetch().then(res => {
//         const bufs = [];
//         res.value.on('data', function(d){ bufs.push(d); });
//         res.value.on('end', function(){
//           const buf = Buffer.concat(bufs);
//           const content = buf.toString("base64");
//           client.add({
//             "className" : "FileContents",
//             "fields": "id",
//             "object" : {
//               "intIsShared" : 1,
//               "strName" : res.filename,
//               "strContents" : content,
//               "strMimeType" : res.contentType,
//               "intSize" : content.length
//             },
//             "callback": function(ret) {
//               if (!ret.error) {
//                 resolve({ contentsId: ret.object.id, filename: res.filename });
//               } else reject(JSON.stringify(ret.error));
//             }
//           });
//         });
//       });
//     });
//   }

//   function uploadContents(filename, contents, mimeType) {
//     return new Promise((resolve, reject) => {
//       client.add({
//         "className" : "FileContents",
//         "fields": "id",
//         "object" : {
//           "intIsShared" : 1,
//           "strName" : filename,
//           "strContents" : contents,
//           "strMimeType" : mimeType
//         },
//         "callback": function(ret) {
//           if (!ret.error) {
//             resolve(ret.object.id);
//           } else reject(JSON.stringify(ret.error));
//         }
//       });
//     });
//   }

};



})()
     