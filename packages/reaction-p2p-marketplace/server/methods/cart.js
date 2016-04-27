
Meteor.methods({
  "cart/checkInventoryQuantity": function (cartId) {
    check(cartId, String);

    let cart = ReactionCore.Collections.Cart.findOne({_id: cartId});
    ReactionCore.Log.info("cart: ",cart);

    for (let item of cart.items) {
      ReactionCore.Log.info("checking cart item: ",item);

      let product = ReactionCore.Collections.Products.findOne({_id: item.productId});
      ReactionCore.Log.info("product for id ",item.productId,": ",product);

      if (parseInt(item.quantity) > parseInt(product.copiedInventoryQuantity)) {
        ReactionCore.Log.info(`cart/addToCart: Not enough items in stock`);
        throw new Meteor.Error(403, "Not enough items in stock");
      }
    }

    return true;
  }
});
