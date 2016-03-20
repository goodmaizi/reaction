
Template.productDetail.onCreated(
  function() {
    /*
    Meteor.setTimeout(function() { // what the?!? document doesn't seem to be ready immediately when this event is fired...
      //if ($('.rateit').length === 0) { // make sure its only injected once, not on every rendered event. should be obsolete with onCreated.
        Blaze.renderWithData(Template.productDetailMarketplaceRating, this.data, $(".col-sm-5.pdp-left-column")[0])
        console.log('injected rating field');
      //}
    }, 100);
    */
  }
);

Template.productDetailMarketplaceRating.onRendered(function(){
  Meteor.setTimeout(function() { // what the?!? document doesn't seem to be ready immediately when this event is fired...
    $('.rateit').rateit();

    $('.rateit').bind('rated', function() {
      console.log('rating: ' + $(this).rateit('value'));

      let rateeId = "rated users Id";
      ReactionCore.Subscriptions.Ratings = ReactionSubscriptions.subscribe("Ratings");
      if (ReactionCore.Subscriptions.Ratings.ready()) {
        let rating = ReactionCore.Collections.Ratings.findOne({raterId: Meteor.userId(), rateeId: rateeId});
        console.log("rating: %o",rating);

        if (rating == null) {
          ReactionCore.Collections.Ratings.insert(
            {
              raterId: Meteor.userId(),
              rateeId: rateeId,
              value: $(this).rateit('value')
            }
          );
          console.log('inserted rating');
        }
        else {
          ReactionCore.Collections.Ratings.update(
            {
              _id: rating._id
            },
            {
              $set: {
                value: $(this).rateit('value')
              }
            }
          );
          console.log('updated rating');
        }
      }

    });

  }, 100);
});
