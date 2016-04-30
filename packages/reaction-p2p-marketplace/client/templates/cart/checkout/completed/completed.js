Template.cartCompletedMarketplace.replaces("cartCompleted");

/**
 * cartCompleted helpers
 *
 * if order status = new translate submitted message
 */
Template.cartCompleted.helpers({
  transactionId: function () {
    return this.billing[0].paymentMethod.transactionId;
  },
});

/**
 * cartCompleted onCreated
 *
 * subscribe to products in order to access the products in subtemplates (ordersListItemsMarketplace / items.js)
 */
Template.cartCompleted.onCreated(function () {
    Meteor.subscribe("ProductsForOrdersHistory", function () {
    });
});
