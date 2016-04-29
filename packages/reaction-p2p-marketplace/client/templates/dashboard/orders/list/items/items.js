Template.ordersListItemsMarketplace.replaces("ordersListItems");

/**
 * ordersListItemsMarketplace helpers
 *
 */

Template.ordersListItems.helpers({
  sellingDate: function(){
    ReactionCore.Subscriptions.Products = ReactionSubscriptions.subscribe("Product", this.productId);
    if (ReactionCore.Subscriptions.Products.ready()) {
      let product =  ReactionCore.Collections.Products.findOne({_id: this.productId});
      ReactionSubscriptions.reset();
      return moment(product.forSaleOnDate).format("DD.MM.YYYY");
    }
    return null;
  },
  pickupTimeFrom: function(){
    ReactionCore.Subscriptions.Products = ReactionSubscriptions.subscribe("Product", this.productId);
    if (ReactionCore.Subscriptions.Products.ready()) {
      let product =  ReactionCore.Collections.Products.findOne({_id: this.productId});
      ReactionSubscriptions.reset();
      return product.pickupTimeFrom;
    }
    return null;
  },
  pickupTimeTo: function(){
    ReactionCore.Subscriptions.Products = ReactionSubscriptions.subscribe("Product", this.productId);
    if (ReactionCore.Subscriptions.Products.ready()) {
      let product =  ReactionCore.Collections.Products.findOne({_id: this.productId});
      ReactionSubscriptions.reset();
      return product.pickupTimeTo;
    }
    return null;
  },
});
