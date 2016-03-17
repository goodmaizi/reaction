
Template.dashboardProductsList.inheritsHelpersFrom("productList"); // for media
Template.dashboardProductsList.inheritsHooksFrom("productList"); // needed to make products show up

Template.dashboardProductsList.helpers({
  products: function (data) { // override to show only this users products
    ReactionCore.Subscriptions.SellerProducts = ReactionSubscriptions.subscribe("SellerProducts");
    if (ReactionCore.Subscriptions.SellerProducts.ready()) {
      //console.log("helper Template.dashboardProductsList.helpers using publication SellerProducts.");
      return ReactionCore.Collections.Products.find({userId: Meteor.userId()});
    }
  },
  media: function () {
    const media = ReactionCore.Collections.Media.findOne({
      "metadata.productId": this._id,
      "metadata.priority": 0,
      "metadata.toGrid": 1
    }, { sort: { uploadedAt: 1 } });

    return media instanceof FS.File ? media : false;
  },
});
