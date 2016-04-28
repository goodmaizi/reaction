Template.cartCompletedMarketplace.replaces("cartCompleted");

/**
 * cartCompleted helpers
 *
 * if order status = new translate submitted message
 */
Template.cartCompleted.helpers({
  transactionId: function () {
    const id =  ReactionRouter.getQueryParam("_id");
    if (id) {
      const ccoSub = Meteor.subscribe("CompletedCartOrder", Meteor.userId(), id);
      if (ccoSub.ready()) {
        let order = ReactionCore.Collections.Orders.findOne({
          userId: Meteor.userId(),
          cartId: ReactionRouter.getQueryParam("_id")
        });
        return order.billing[0].paymentMethod.transactionId;
      }
    }
  },
});
