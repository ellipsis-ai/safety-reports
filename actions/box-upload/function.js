function(file, ellipsis) {
  const boxFiles = require('box-files')(ellipsis);

file.fetch().then(res => {
  boxFiles.uploadWithTimestamp(res.filename, res.contentType, res.value).then(r => {
    ellipsis.success(JSON.stringify(r));
  }).catch(ellipsis.error);
}).catch(ellipsis.error);
}
