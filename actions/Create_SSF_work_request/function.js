function(department, location, description, urgency, notes, file, ellipsis) {
  const workRequests = require('work-requests')(ellipsis);

const followUpUserId = ellipsis.env.SSF_WORK_REQUEST_FOLLOW_UP_USER_ID;
const updateChannel = ellipsis.env.SSF_WORK_REQUEST_UPDATE_CHANNEL;

workRequests.createAndRespond(department, location, description, urgency, notes, file, followUpUserId, updateChannel);
}
