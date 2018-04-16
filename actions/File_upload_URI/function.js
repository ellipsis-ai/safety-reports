function(ellipsis) {
  const client = require('fiix-sdk')(ellipsis);

ellipsis.success(client.calcFileUploadURI());
}
