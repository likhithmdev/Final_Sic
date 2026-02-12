/**
 * In-memory store for the user currently "checked in" to the bin.
 * When trash is segregated (plastic/e-waste), points are credited to this user.
 */
let activeUserId = null;

module.exports = {
  setActiveUser(userId) {
    activeUserId = userId;
  },

  clearActiveUser() {
    activeUserId = null;
  },

  getActiveUser() {
    return activeUserId;
  },

  isActiveUser(userId) {
    return activeUserId !== null && activeUserId === userId;
  },
};
