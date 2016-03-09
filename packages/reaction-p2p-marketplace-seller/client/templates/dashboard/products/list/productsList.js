
Template.dashboardProductsList.inheritsHelpersFrom("productList"); // for media
Template.dashboardProductsList.inheritsHooksFrom("productGrid"); // needed to make products show up

Template.dashboardProductsList.helpers({
  products: function (data) { // override to show only this users products
    ReactionCore.Subscriptions.SellerProducts = ReactionSubscriptions.subscribe("SellerProducts");
    if (ReactionCore.Subscriptions.SellerProducts.ready()) {
      //console.log("helper Template.dashboardProductsList.helpers using publication SellerProducts.");
      return ReactionCore.Collections.Products.find({userId: Meteor.userId()});
    }
  },
});
