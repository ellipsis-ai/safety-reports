function(file, ellipsis) {
  const files = require('files')(ellipsis);

files.upload(file).then(res => {
  ellipsis.success(JSON.stringify(res));
});
}
