function(department, location, description, urgency, notes, ellipsis) {
  const workRequests = require('work-requests')(ellipsis);

const followUpUserId = ellipsis.env.WORK_REQUEST_FOLLOW_UP_USER_ID;
const updateChannel = ellipsis.env.WORK_REQUEST_UPDATE_CHANNEL;

workRequests.createAndRespond(department, location, description, urgency, notes, followUpUserId, updateChannel);
}
