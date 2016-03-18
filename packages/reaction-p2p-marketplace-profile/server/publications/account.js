/**
 * product detail publication
 * @param {String} productId - productId or handle
 * @return {Object} return product cursor
 */
Meteor.publish("ProfileAccount", function (userId) {
  check(userId, Match.OptionalOrNull(String));
  if (!userId) {
    ReactionCore.Log.info("ignoring null request on ProfileAccount subscription");
    return this.ready();
  }

  return ReactionCore.Collections.Accounts.find({_id: userId});
});
