
ReactionCore.Collections.Ratings.allow({
  insert: function(userId, rating) {
    if (Match.test(rating, ReactionCore.Schemas.Ratings)) {
      return true
    }
    return false
  },
  /*
  update: function(userId, analyticsEvent, fields, modifier) {
    if (modifier.$set && modifier.$set.shopId) {
      return false;
    }
    return true;
  },
  remove: function(userId, analyticsEvent) {
    if (analyticsEvent.shopId !== ReactionCore.getShopId()) {
      return false;
    }
    return true;
  }*/
});
