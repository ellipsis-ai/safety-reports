function(file, ellipsis) {
  const box = require('ellipsis-box');

file.fetch().then(res => {
  box.files(ellipsis).uploadWithTimestamp(res.filename, res.contentType, res.value).then(r => {
    ellipsis.success(JSON.stringify(r));
  }).catch(ellipsis.error);
}).catch(ellipsis.error);
}
