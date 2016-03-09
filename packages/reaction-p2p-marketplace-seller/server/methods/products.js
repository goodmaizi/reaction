
/**
 * @function belongsToCurrentUser
 * @description checks if product belongs to current user
 * @param {String} existing product _id
 * @return {Boolean}
 */
function belongsToCurrentUser(productId) {
  let productBelongingToCurrUser = ReactionCore.Collections.Products.findOne({_id:productId, userId:Meteor.userId()})
  ReactionCore.Log.info("Product ",productId," belongs to ",Meteor.userId(),"?");
  ReactionCore.Log.info("productBelongingToCurrUser ",productBelongingToCurrUser);
  return productBelongingToCurrUser != null;
}

ReactionCore.MethodHooks.after('products/createProduct', function(options) {

      // after function here

      // options.arguments is an array that carries all params on the original method.
      // For example with `orders/orderCompleted` the order param is the first (and only) param.
      var productId = options.result;

      console.log("ReactionCore.MethodHooks.before('products/createProduct') options: ", options);

      let product = ReactionCore.Collections.Products.findOne({_id: productId});
      console.log("setting userId on prod: %o", product);
      //product.userId = Meteor.userId();

      const type = product.type;

      const result = ReactionCore.Collections.Products.update(productId, {
        $set: {userId: Meteor.userId()}
      }, { selector: { type: type } });

      // To be safe, return the options.result in an after hook.
      return options.result;
});

ReactionCore.MethodHooks.before('products/updateProductField', function(options) {
  var productId = options.arguments[0];

  console.log("ReactionCore.MethodHooks.before('products/updateProductField') options: ", options);

  //throw new Meteor.Error(403, "Access Denied OLO");
  if (!ReactionCore.hasPermission("createProduct") || !belongsToCurrentUser(productId)) {
    throw new Meteor.Error(403, "Access Denied ADL");
  }
});
