
Template.sellerOrders.inheritsHelpersFrom(["orders", "productDetailEdit"]);
Template.sellerOrders.inheritsEventsFrom(["orders", "productDetailEdit"]);
Template.sellerOrders.inheritsHooksFrom(["orders", "productDetailEdit"]);

/**
 * Seller orders helpers
 */
Template.sellerOrders.helpers({
  orders() {
    ReactionCore.Subscriptions.SellerOrders = ReactionSubscriptions.subscribe("SellerOrders");
    if (ReactionCore.Subscriptions.SellerOrders.ready()) {
      const template = Template.instance();
      const queryParams = ReactionRouter.getQueryParam("filter");
      template.orders = getOrders(queryParams);
      return template.orders;
    }
  },
});
