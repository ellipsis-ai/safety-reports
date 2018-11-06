function(department, location, description, desiredCompletion, notes, ellipsis) {
  const workRequests = require('work-requests')(ellipsis);
workRequests.createAndRespond(department, location, description, desiredCompletion, notes);
}
