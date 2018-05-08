/*
@exportId PvCZY_iSRmugPOVHpiEwuA
*/
module.exports = (function() {
return ellipsis => {
  const client = require('box-sdk')(ellipsis);
  
  return {
    
    uploadWithTimestamp: function(filename, contentType, dataStream) {
      return new Promise((resolve, reject) => {
        const timestampedFilename = `${Number(new Date())}-${filename}`;
        client.files.uploadFile('0', timestampedFilename, dataStream, (err, res) => {
          if (err) {
            reject(err);
          } else {
            const fileId = res.entries[0].id;
            if (fileId) {
              client.files.getDownloadURL(fileId, null, (err, url) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(url);
                }
              });
            } else {
              reject("No file ID");
            }
          }
        });
      });
    }
    
  };
  
}

})()
     