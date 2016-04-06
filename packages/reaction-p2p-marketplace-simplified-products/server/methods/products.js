
/**
 * Add userId to new products
 */
ReactionCore.MethodHooks.after('products/createProduct', function(options) {
  ReactionCore.Log.info("ReactionCore.MethodHooks.after('products/createProduct') options: ", options);
  var productId = options.result; //options.arguments[0];

  const product = ReactionCore.Collections.Products.findOne(productId);
  const variants = ReactionCore.Collections.Products.find({
    ancestors: { $in: [productId] }
  }).fetch();
  let variantValidator = true;

  if (typeof product === "object") {
    for (let variant of variants) {
      ReactionCore.Collections.Products.update(variant._id,
        {
          $set:
          {
            title: product.title,
            compareAtPrice: 1,
            weight: 1,
            inventoryQuantity: 1
          }
        },
        {
          selector: {type: "variant"}
        }
      );
      ReactionCore.Log.info("ReactionCore.MethodHooks.after('products/updateProductField') set variant default values on "+variant._id);
    }
  }

  // To be safe, return the options.result in an after hook.
  return options.result;
});
