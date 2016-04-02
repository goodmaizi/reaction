
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

    let account =  ReactionCore.Collections.Accounts.findOne({userId: Meteor.userId()});
    ReactionCore.Log.info("address count", account.profile.addressBook.length);
    if (account.profile.addressBook.length <= 0) {
      ReactionCore.Log.info("No address. throw error!");
      throw new Meteor.Error(403, "error.noProfileAddress");
      //errorMsg += "Profile address required.";
      //template.$(".title-edit-input").focus();
    }

    const product = ReactionCore.Collections.Products.findOne(productId);
    const variants = ReactionCore.Collections.Products.find({
      ancestors: { $in: [productId] }
    }).fetch();
    let variantValidator = true;

    if (typeof product === "object" && product.title.length > 1) {
      if (variants.length > 0) {
        variants.map(variant => {
          if (!(typeof variant.price === "number" && variant.price > 0 &&
            typeof variant.title === "string" && variant.title.length > 1)) {
            variantValidator = false;
          }
          if (typeof optionTitle === "string" && !(optionTitle.length > 0)) {
            variantValidator = false;
          }
        });
      } else {
        ReactionCore.Log.debug("invalid product active state ", productId);
        throw new Meteor.Error(403, "Forbidden", "Variant is required");
      }

      if (!variantValidator) {
        ReactionCore.Log.debug("invalid product active state ", productId);
        throw new Meteor.Error(403, "Forbidden",
          "Some properties are missing.");
      }

      // update product visibility
      ReactionCore.Log.info("toggle product active state ", product._id, !
        product.isActive);

      return Boolean(ReactionCore.Collections.Products.update(product._id, {
        $set: {
          isActive: !product.isActive
        }
      }, { selector: { type: "simple" } }));
    }
    ReactionCore.Log.debug("invalid product active state ", productId);
    throw new Meteor.Error(400, "Bad Request");
  },
});

/**
 * Add userId to new products
 */
ReactionCore.MethodHooks.after('products/createProduct', function(options) {
  ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/createProduct') options: ", options);

  var productId = options.result;
  let product = ReactionCore.Collections.Products.findOne({_id: productId});
  ReactionCore.Log.info("setting userId on prod: %o", product);
  //product.userId = Meteor.userId();

  const type = product.type;
  const result = ReactionCore.Collections.Products.update(productId, {
    $set: {userId: Meteor.userId()}
  }, { selector: { type: type } });

  // To be safe, return the options.result in an after hook.
  return options.result;
});

ReactionCore.MethodHooks.before('products/cloneVariant', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/cloneVariant') options: ", options);
  var productId = options.arguments[0];
  var variantId = options.arguments[1];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/cloneVariant') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/createVariant', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/createVariant') options: ", options);
  var productId = options.arguments[0];
  var variantId = options.arguments[1];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/createVariant') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
  else {
    ReactionCore.Log.info("creating Variant");
  }
});

ReactionCore.MethodHooks.before('products/deleteProduct', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/deleteProduct') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/deleteProduct') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/updateProductField', function(options) {
  ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductField') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductField') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }

  // translate date to US format for saving
  if (options.arguments.length >= 3) {
    if (options.arguments[1] == "forSaleOnDate") {
      //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductField') from:",options.arguments[2]);

      // this seems to provoke: Exception while invoking method 'products/updateProductField' Error: Did not check() all arguments during call to 'products/updateProductField'
      // but the value is still saved...
      options.arguments[2] = moment(options.arguments[2], "DD.MM.YYYY").format('MM/DD/YYYY');

      //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductField') to:",options.arguments[2]);
    }
    if (options.arguments[1] == "latestOrderDate") {
      //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductField') from:",options.arguments[2]);

      // this seems to provoke: Exception while invoking method 'products/updateProductField' Error: Did not check() all arguments during call to 'products/updateProductField'
      // but the value is still saved...
      options.arguments[2] = moment(options.arguments[2], "DD.MM.YYYY hh:mm").format('MM/DD/YYYY hh:mm');

      //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductField') to:",options.arguments[2]);
    }
  }
});

ReactionCore.MethodHooks.after('products/updateProductField', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.after('products/updateProductField') options: ", options);
  var productId = options.arguments[0];

  const product = ReactionCore.Collections.Products.findOne(productId);
  const variants = ReactionCore.Collections.Products.find({
    ancestors: { $in: [productId] }
  }).fetch();
  let variantValidator = true;

  if (typeof product === "object" && product.title.length > 1) {
    for (let variant of variants) {
      ReactionCore.Collections.Products.update(variant._id,
        {$set: {title: product.title}},
        {selector: {type: "variant"}}
      );
      ReactionCore.Log.info("ReactionCore.MethodHooks.after('products/updateProductField') set variant title to :", product.title);
    }
  }

  // To be safe, return the options.result in an after hook.
  return options.result;
});

ReactionCore.MethodHooks.before('products/updateProductTags', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductTags') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductTags') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/removeProductTag', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/removeProductTag') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/removeProductTag') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/setHandle', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/setHandle') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/setHandle') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/setHandleTag', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/setHandleTag') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/setHandleTag') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/updateProductPosition', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductPosition') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateProductPosition') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/updateMetaFields', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateMetaFields') options: ", options);
  var productId = options.arguments[0];

  if (!belongsToCurrentUser(productId)) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/updateMetaFields') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});

ReactionCore.MethodHooks.before('products/publishProduct', function(options) {
  //ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/publishProduct') options: ", options);
  var productId = options.arguments[0];

  if (!ReactionCore.hasAdminAccess()) {
    ReactionCore.Log.info("ReactionCore.MethodHooks.before('products/publishProduct') Access Denied!");
    throw new Meteor.Error(403, "Access Denied");
  }
});
