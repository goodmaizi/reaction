/**
 * dashboardProductsList helpers
 *
 */
Template.dashboardProductsList.helpers({
  /*
  orderStatus: function () {
    if (this.workflow.status === "coreOrderCompleted") {
      return true;
    }
  },*/
  products: function (data) {
    ReactionCore.Log.debug("products: sreaching products for use ", Meteor.userId());
    if (data.hash.data) {
      return data.hash.data;
    }
    return ReactionCore.Collections.Products.find({userId: Meteor.userId()}, {
      sort: {
        createdAt: -1
      },
      limit: 25
    });
  },
  shopName: function () {
    let shop = ReactionCore.Collections.Shops.findOne(this.shopId);
    return shop !== null ? shop.name : void 0;
  }
});
