
/**
 * @function belongsToCurrentUser
 * @description checks if product belongs to current user
 * @param {String} existing product _id
 * @return {Boolean}
 */
function belongsToCurrentUser(productId) {
  if (_.isArray(productId) === true) {
    productId = productId[0];
  }

  let productBelongingToCurrUser = ReactionCore.Collections.Products.findOne({_id:productId, userId:Meteor.userId()})
  ReactionCore.Log.info("Product ",productId," belongs to ",Meteor.userId(),"?");
  ReactionCore.Log.info("productBelongingToCurrUser ",productBelongingToCurrUser);
  return productBelongingToCurrUser != null;
}

Meteor.methods({
  "products/belongsToCurrentUser": function (productId) {
    check(productId, Match.OneOf(Array, String));

    return belongsToCurrentUser(productId);
  },
  /**
   * products/activateProduct
   * @summary owner controlled sctivation of product
   * @param {String} productId - productId
   * @return {String} return
   */
  "products/activateProduct": function (productId) {
    check(productId, String);
    if (!belongsToCurrentUser(productId)) {
      throw new Meteor.Error(403, "Access Denied");
    }
    this.unblock();

    let product = ReactionCore.Collections.Products.findOne(productId);

    if ((product !== null ? product.variants[0].price : void 0) && (
        product !== null ? product.variants[0].title : void 0) && (
        product !==
        null ? product.title : void 0)) {
      // update product visibility
      ReactionCore.Log.info("toggle product active state ", product._id, !
        product.isVisible);

      ReactionCore.Collections.Products.update(product._id, {
        $set: {
          isActive: !product.isActive
        }
      });
      return ReactionCore.Collections.Products.findOne(product._id).isActive;
    }
    ReactionCore.Log.debug("invalid product active state ", productId);
    throw new Meteor.Error(400, "Bad Request");
  },
});

/**
 * Add userId to new products
 */
ReactionCore.MethodHooks.after('products/createProduct', function(options) {
  console.log("ReactionCore.MethodHooks.before('products/createProduct') options: ", options);

  var productId = options.result;
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

ReactionCore.MethodHooks.before('products/cloneVariant', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/cloneVariant') options: ", options);
  var productId = options.arguments[0];
  var variantId = options.arguments[1];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/cloneVariant') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/createVariant', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/createVariant') options: ", options);
  var productId = options.arguments[0];
  var variantId = options.arguments[1];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/createVariant') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/deleteProduct', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/deleteProduct') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/deleteProduct') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/updateProductField', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/updateProductField') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/updateProductField') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/updateProductTags', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/updateProductTags') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/updateProductTags') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/removeProductTag', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/removeProductTag') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/removeProductTag') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/setHandle', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/setHandle') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/setHandle') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/setHandleTag', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/setHandleTag') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/setHandleTag') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/updateProductPosition', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/updateProductPosition') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/updateProductPosition') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/updateMetaFields', function(options) {
  //console.log("ReactionCore.MethodHooks.before('products/updateMetaFields') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    console.log("ReactionCore.MethodHooks.before('products/updateMetaFields') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});
