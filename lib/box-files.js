/*
@exportId PvCZY_iSRmugPOVHpiEwuA
*/
module.exports = (function() {
const fs = require('fs');

return ellipsis => {
  const client = require('box-sdk')(ellipsis);
  
  return {
    
    uploadWithTimestamp: function(filename, contentType, dataStream) {
      return new Promise((resolve, reject) => {
        const timestampedFilename = `${Number(new Date())}-${filename}`;
        const tmpFilePath = `/tmp/${timestampedFilename}`;
        dataStream.pipe(fs.createWriteStream(tmpFilePath)).on('finish', () => {
          client.files.uploadFile('0', timestampedFilename, fs.createReadStream(tmpFilePath)).then(res => {
            const fileId = res.entries[0].id;
            if (fileId) {
              client.files.update(fileId, {shared_link: client.accessLevels.DEFAULT}).then(file => {
                resolve(file.shared_link.url);
              });
            } else {
              reject("No file ID");
            }
          });
        });
      });
    }
    
  };
  
}

})()
     