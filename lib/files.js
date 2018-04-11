/*
@exportId qbBJPEhmQGCohwPcGiMqHg
*/
module.exports = (function() {
return ellipsis => {
  const client = require('fiix-sdk')(ellipsis);

  return {
    uploadContents: (filename, contents, mimeType) => uploadContents(filename, contents, mimeType, client)
  };

};

function create(filename, contents, mimeType, client) {
  
}

function uploadContents(filename, contents, mimeType, client) {
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
        } else reject(ret.error);
      }
    });
  });
}
})()
     