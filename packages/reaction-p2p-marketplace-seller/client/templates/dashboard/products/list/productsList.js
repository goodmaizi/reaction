
Template.dashboardProductsList.inheritsHelpersFrom("productList"); // for media
Template.dashboardProductsList.inheritsHooksFrom("productGrid"); // needed to make products show up

Template.dashboardProductsList.helpers({
  products: function (data) { // override to show only this users products
    return ReactionCore.Collections.Products.find({userId: Meteor.userId()});
  },
});
