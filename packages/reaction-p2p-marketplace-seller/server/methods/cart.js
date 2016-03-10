
// "cart/addToCart": function (productId, variantId, itemQty) {
ReactionCore.MethodHooks.after('cart/addToCart', function(options) {
  console.log("ReactionCore.MethodHooks.before('cart/addToCart') options: ", options);

  const cart = ReactionCore.Collections.Cart.findOne({ userId: this.userId });

  var productId = options.arguments[0];
  var variantId = options.arguments[1];

  let product = ReactionCore.Collections.Products.findOne({_id: productId});

  const cartVariantExists = cart.items && cart.items
    .some(item => item.variants._id === variantId);

  if (cartVariantExists) {
    ReactionCore.Log.info("try setting sellerId...");

    ReactionCore.Collections.Cart.update(
      {
        "_id": cart._id,
        "items.variants._id": variantId
      },
      {
        $set: {
          "items.$.sellerId": product.userId
        }
      },
      function (error, result) {
        if (error) {
          ReactionCore.Log.warn("error setting sellerId in cart item.");
          throw new Meteor.Error(500, "Setting sellerId failed.");
        }
        else {
          ReactionCore.Log.info("apparently successful!");
        }
      }
    );
  }

  // To be safe, return the options.result in an after hook.
  return options.result;
});
