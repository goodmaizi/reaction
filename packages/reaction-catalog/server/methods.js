/**
 * Reaction Product Methods
 */
/* eslint new-cap: 0 */
/* eslint no-loop-func: 0 */
/* eslint quotes: 0 */

/**
 * @array toDenormalize
 * @summary contains a list of fields, which should be denormalized
 * @type {string[]}
 */
const toDenormalize = [
  "price",
  "inventoryQuantity",
  "lowInventoryWarningThreshold",
  "inventoryPolicy",
  "inventoryManagement"
];

/**
 * @function createTitle
 * @description Recursive method which trying to find a new `title`, given the
 * existing copies
 * @param {String} newTitle - product `title`
 * @param {String} productId - current product `_id`
 * @return {String} title - modified `title`
 */
function createTitle(newTitle, productId) {
  // exception product._id needed for cases then double triggering happens
  let title = newTitle || "";
  let titleCount = ReactionCore.Collections.Products.find({
    title: title,
    _id: {
      $nin: [productId]
    }
  }).count();
  // current product "copy" number
  let titleNumberSuffix = 0;
  // product handle prefix
  let titleString = title;
  // copySuffix "-copy-number" suffix of product
  let copySuffix = titleString.match(/-copy-\d+$/) || titleString.match(/-copy$/);
  // if product is a duplicate, we should take the copy number, and cut
  // the handle
  if (copySuffix) {
    // we can have two cases here: copy-number and just -copy. If there is
    // no numbers in copySuffix then we should put 1 in handleNumberSuffix
    titleNumberSuffix = +String(copySuffix).match(/\d+$/) || 1;
    // removing last numbers and last "-" if it presents
    titleString = title.replace(/\d+$/, '').replace(/-$/, '');
  }

  // if we have more than one product with the same handle, we should mark
  // it as "copy" or increment our product handle if it contain numbers.
  if (titleCount > 0) {
    // if we have product with name like "product4", we should take care
    // about its uniqueness
    if (titleNumberSuffix > 0) {
      title = `${titleString}-${titleNumberSuffix + titleCount}`;
    } else {
      // first copy will be "...-copy", second: "...-copy-2"
      title = `${titleString}-copy${ titleCount > 1 ? "-" + titleCount : ""}`;
    }
  }

  // we should check again if there are any new matches with DB
  if (ReactionCore.Collections.Products.find({
    title: title
  }).count() !== 0) {
    title = createTitle(title, productId);
  }
  return title;
}

/**
 * @function createHandle
 * @description Recursive method which trying to find a new `handle`, given the
 * existing copies
 * @param {String} productHandle - product `handle`
 * @param {String} productId - current product `_id`
 * @return {String} handle - modified `handle`
 */
function createHandle(productHandle, productId) {
  let handle = productHandle || "";
  // exception product._id needed for cases then double triggering happens
  let handleCount = ReactionCore.Collections.Products.find({
    handle: handle,
    _id: { $nin: [productId] }
  }).count();
  // current product "copy" number
  let handleNumberSuffix = 0;
  // product handle prefix
  let handleString = handle;
  // copySuffix "-copy-number" suffix of product
  let copySuffix = handleString.match(/-copy-\d+$/)
    || handleString.match(/-copy$/);

  // if product is a duplicate, we should take the copy number, and cut
  // the handle
  if (copySuffix) {
    // we can have two cases here: copy-number and just -copy. If there is
    // no numbers in copySuffix then we should put 1 in handleNumberSuffix
    handleNumberSuffix = +String(copySuffix).match(/\d+$/) || 1;
    // removing last numbers and last "-" if it presents
    handleString = handle.replace(/\d+$/, '').replace(/-$/, '');
  }

  // if we have more than one product with the same handle, we should mark
  // it as "copy" or increment our product handle if it contain numbers.
  if (handleCount > 0) {
    // if we have product with name like "product4", we should take care
    // about its uniqueness
    if (handleNumberSuffix > 0) {
      handle = `${handleString}-${handleNumberSuffix + handleCount}`;
    } else {
      // first copy will be "...-copy", second: "...-copy-2"
      handle = `${handleString}-copy${ handleCount > 1
        ? '-' + handleCount : ''}`;
    }
  }

  // we should check again if there are any new matches with DB
  if (ReactionCore.Collections.Products.find({
    handle: handle
  }).count() !== 0) {
    handle = createHandle(handle, productId);
  }

  return handle;
}

/**
 * @function copyMedia
 * @description copy images links to cloned variant from original
 * @param {String} newId - [cloned|original] product _id
 * @param {String} variantOldId - old variant _id
 * @param {String} variantNewId - - cloned variant _id
 * @return {Number} ReactionCore.Collections.Media#update result
 */
function copyMedia(newId, variantOldId, variantNewId) {
  ReactionCore.Collections.Media.find({
    "metadata.variantId": variantOldId
  }).forEach(function (fileObj) {
    let newFile = fileObj.copy();
    return newFile.update({
      $set: {
        "metadata.productId": newId,
        "metadata.variantId": variantNewId
      }
    });
  });
}
/**
 * @function belongsToCurrentUser
 * @description checks if product belongs to current user
 * @param {String} existing product _id
 * @return {Boolean}
 */
function belongsToCurrentUser(productId) {
  let productBelongingToCurrUser = ReactionCore.Collections.Products.findOne({_id:productId, userId:Meteor.userId()})
  return productBelongingToCurrUser != null;
}

/**
 * @function denormalize
 * @description With flattened model we do not want to get variant docs in
 * `products` publication, but we need some data from variants to display price,
 * quantity, etc. That's why we are denormalizing these properties into product
 * doc. Also, this way should have a speed benefit comparing the way where we
 * could dynamically build denormalization inside `products` publication.
 * @summary update product denormalized properties if variant was updated or
 * removed
 * @param {String} id - product _id
 * @param {String} field - type of field. Could be:
 * "price",
 * "inventoryQuantity",
 * "inventoryManagement",
 * "inventoryPolicy",
 * "lowInventoryWarningThreshold"
 * @since 0.11.0
 * @return {Number} - number of successful update operations. Should be "1".
 */
function denormalize(id, field) {
  const doc = ReactionCore.Collections.Products.findOne(id);
  let variants;
  if (doc.type === "simple") {
    variants = ReactionCore.getTopVariants(id);
  } else if (doc.type === "variant" && doc.ancestors.length === 1) {
    variants = ReactionCore.getVariants(id);
  }
  let update = {};

  switch (field) {
  case "inventoryPolicy":
  case "inventoryQuantity":
  case "inventoryManagement":
    Object.assign(update, {
      isSoldOut: isSoldOut(variants),
      isLowQuantity: isLowQuantity(variants),
      isBackorder: isBackorder(variants)
    });
    break;
  case "lowInventoryWarningThreshold":
    Object.assign(update, {
      isLowQuantity: isLowQuantity(variants)
    });
    break;
  default: // "price"
    // set "0" if no variants in product. If all variants were removed.
    const priceRange = ReactionCore.getProductPriceRange(id) || 0;
    Object.assign(update, { price: priceRange });
  }

  ReactionCore.Collections.Products.update(id, {
    $set: update
  }, { selector: { type: "simple" } });
}

/**
 * isSoldOut
 * @description We are stop accepting new orders if product marked as
 * `isSoldOut`.
 * @param {Array} variants - Array with top-level variants
 * @return {Boolean} true if summary product quantity is zero.
 */
function isSoldOut(variants) {
  return variants.every(variant => {
    if (variant.inventoryManagement && variant.inventoryPolicy) {
      return ReactionCore.getVariantQuantity(variant) === 0;
    }
    return false;
  });
}

/**
 * isLowQuantity
 * @description If at least one of the variants is less than the threshold,
 * then function returns `true`
 * @param {Array} variants - array of child variants
 * @return {boolean} low quantity or not
 */
function isLowQuantity(variants) {
  return variants.some(variant => {
    const quantity = ReactionCore.getVariantQuantity(variant);
    // we need to keep an eye on `inventoryPolicy` too and qty > 0
    if (variant.inventoryManagement && variant.inventoryPolicy && quantity) {
      return quantity <= variant.lowInventoryWarningThreshold;
    }
    // TODO: need to test this function with real data
    return false;
  });
}

/**
 * isBackorder
 * @description Is products variants is still available to be ordered after
 * summary variants quantity is zero
 * @param {Array} variants - array with variant objects
 * @return {boolean} is backorder allowed or now for a product
 */
function isBackorder(variants) {
  return variants.every(variant => {
    return !variant.inventoryPolicy && variant.inventoryManagement &&
      variant.inventoryQuantity === 0;
  });
}

/**
 * flushQuantity
 * @description if variant `inventoryQuantity` not zero, function update it to
 * zero. This needed in case then option with it's own `inventoryQuantity`
 * creates to top-level variant. In that case top-level variant should display
 * sum of his options `inventoryQuantity` fields.
 * @param {String} id - variant _id
 * @return {Number} - collection update results
 */
function flushQuantity(id) {
  const variant = ReactionCore.Collections.Products.findOne(id);
  // if variant already have descendants, quantity should be 0, and we don't
  // need to do all next actions
  if (variant.inventoryQuantity === 0) {
    return 1; // let them think that we have one successful operation here
  }

  return ReactionCore.Collections.Products.update({ _id: id}, {
    $set: { inventoryQuantity: 0 }
  }, { selector: { type: "variant" } });
}

Meteor.methods({
  /**
   * products/cloneVariant
   * @summary clones a product variant into a new variant
   * @description the method copies variants, but will also create and clone
   * child variants (options)
   * @param {String} productId - the productId we're whose variant we're
   * cloning
   * @param {String} variantId - the variantId that we're cloning
   * @todo rewrite @description
   * @return {String} - cloned variant _id
   */
  "products/cloneVariant": function (productId, variantId) {
    check(productId, String);
    check(variantId, String);
    // user needs createProduct permission to clone
    if (!ReactionCore.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    const variants = ReactionCore.Collections.Products.find({
      $or: [{ _id: variantId }, { ancestors: { $in: [variantId] }}],
      type: "variant"
    }).fetch();
    // exit if we're trying to clone a ghost
    if (variants.length === 0) {
      return;
    }
    const variantNewId = Random.id(); // for the parent variant
    // we need to make sure that top level variant will be cloned first, his
    // descendants later.
    // we could use this way in future: http://stackoverflow.com/questions/
    // 9040161/mongo-order-by-length-of-array, by now following are allowed
    // @link http://underscorejs.org/#sortBy
    const sortedVariants = _.sortBy(variants, doc => doc.ancestors.length);

    sortedVariants.map(variant => {
      const oldId = variant._id;
      let type = "child";
      let clone = {};
      if (variantId === variant._id) {
        type = "parent";
        Object.assign(clone, variant, {
          _id: variantNewId,
          title: ""
        });
      } else {
        const parentIndex = variant.ancestors.indexOf(variantId);
        const ancestorsClone = variant.ancestors.slice(0);
        // if variantId exists in ancestors, we override it by new _id
        !!~parentIndex && ancestorsClone.splice(parentIndex, 1, variantNewId);
        Object.assign(clone, variant, {
          _id: Random.id(),
          ancestors: ancestorsClone,
          optionTitle: "",
          title: ""
        });
      }
      delete clone.updatedAt;
      delete clone.createdAt;
      delete clone.inventoryQuantity;
      copyMedia(productId, oldId, clone._id);

      return ReactionCore.Collections.Products.insert(clone, {
        validate: false
      }, (error, result) => {
        if (result) {
          if (type === "child") {
            ReactionCore.Log.info(
              `products/cloneVariant: created sub child clone: ${
                clone._id} from ${variantId}`
            );
          } else {
            ReactionCore.Log.info(
              `products/cloneVariant: created clone: ${
                clone._id} from ${variantId}`
            );
          }
        }
        if (error) {
          ReactionCore.Log.error(
            `products/cloneVariant: cloning of ${variantId} was failed: ${
              error}`
          );
        }
      });
    });
  },

  /**
   * products/createVariant
   * @summary initializes empty variant template
   * @param {String} parentId - the product _id or top level variant _id where
   * we create variant
   * @param {Object} [newVariant] - variant object
   * @return {String} new variantId
   */
  "products/createVariant": function (parentId, newVariant) {
    check(parentId, String);
    check(newVariant, Match.Optional(Object));
    // must have createProduct permissions
    if (!ReactionCore.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    const newVariantId = Random.id();
    // get parent ancestors to build new ancestors array
    const { ancestors } = ReactionCore.Collections.Products.findOne(parentId);
    Array.isArray(ancestors) && ancestors.push(parentId);
    const assembledVariant = Object.assign(newVariant || {}, {
      _id: newVariantId,
      ancestors: ancestors,
      type: "variant"
    });

    if (!newVariant) {
      Object.assign(assembledVariant, {
        title: "",
        price: 0.00
      });
    }

    // if we are inserting child variant to top-level variant, we need to remove
    // all top-level's variant inventory records and flush it's quantity,
    // because it will be hold sum of all it descendants quantities.
    if (ancestors.length === 2) {
      flushQuantity(parentId);
    }

    ReactionCore.Collections.Products.insert(assembledVariant,
      (error, result) => {
        if (result) {
          ReactionCore.Log.info(
            `products/createVariant: created variant: ${
              newVariantId} for ${parentId}`
          );
        }
      }
    );

    return newVariantId;
  },

  /**
   * products/updateVariant
   * @summary update individual variant with new values, merges into original
   * only need to supply updated information. Currently used for a one use case
   * - to manage top-level variant autoform.
   * @param {Object} variant - current variant object
   * @todo some use cases of this method was moved to "products/
   * updateProductField", but it still used
   * @return {Number} returns update result
   */
  "products/updateVariant": function (variant) {
    check(variant, Object);
    // must have createProduct permissions
    if (!ReactionCore.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    const { Products } = ReactionCore.Collections;
    let currentVariant = Products.findOne(variant._id);
    // update variants
    if (typeof currentVariant === "object") {
      const newVariant = Object.assign({}, currentVariant, variant);

      return Products.update({
        _id: variant._id
      }, {
        $set: newVariant // newVariant already contain `type` property, so we
        // do not need to pass it explicitly
      }, {
        validate: false
      }, (error, result) => {
        if (result) {
          const productId = currentVariant.ancestors[0];
          // we need manually check is these fields were updated?
          // we can't stop after successful denormalization, because we have a
          // case when several fields could be changed in top-level variant
          // before form will be submitted.
          toDenormalize.forEach(field => {
            if (currentVariant[field] !== variant[field]) {
              denormalize(productId, field);
            }
          });
        }
      });
    }
  },

  /**
   * products/deleteVariant
   * @summary delete variant, which should also delete child variants
   * @param {String} variantId - variantId to delete
   * @returns {Boolean} returns update results: `true` - if at least one variant
   * was removed or `false` if nothing was removed
   */
  "products/deleteVariant": function (variantId) {
    check(variantId, String);
    // must have createProduct permissions
    if (!ReactionCore.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    const selector = {
      $or: [{
        _id: variantId
      }, {
        ancestors: {
          $in: [variantId]
        }
      }]
    };
    const toDelete = ReactionCore.Collections.Products.find(selector).fetch();
    // out if nothing to delete
    if (!Array.isArray(toDelete) || toDelete.length === 0) return false;

    const deleted = ReactionCore.Collections.Products.remove(selector);
    toDelete.forEach(variant => {
      // useless to return results here because all happens async
      ReactionCore.Collections.Media.remove({
        "metadata.variantId": variant._id
      });
    });

    // after variant were removed from product, we need to recalculate all
    // denormalized fields
    const productId = toDelete[0].ancestors[0];
    toDenormalize.forEach(field => denormalize(productId, field));

    return typeof deleted === "number" && deleted > 0;
  },

  /**
   * products/cloneProduct
   * @summary clone a whole product, defaulting visibility, etc
   * in the future we are going to do an inheritance product
   * that maintains relationships with the cloned product tree
   * @param {Array} productOrArray - products array to clone
   * @returns {Array} returns insert results
   */
  "products/cloneProduct": function (productOrArray) {
    check(productOrArray, Match.OneOf(Array, Object));
    // must have createProduct permissions
    if (!ReactionCore.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }
    // this.unblock();

    let result;
    let products;
    const results = [];
    const pool = []; // pool of id pairs: { oldId, newId }

    function getIds(id) {
      return pool.filter(function (pair) {
        return pair.oldId === this.id;
      }, { id: id });
    }
    function setId(ids) {
      return pool.push(ids);
    }
    function buildAncestors(ancestors) {
      const newAncestors = [];
      ancestors.map(oldId => {
        let pair = getIds(oldId);
        // TODO do we always have newId on this step?
        newAncestors.push(pair[0].newId);
      });
      return newAncestors;
    }

    if (!Array.isArray(productOrArray)) {
      products = [productOrArray];
    } else {
      products = productOrArray;
    }

    for (let product of products) {
      // cloning product
      let productNewId = Random.id();
      setId({ oldId: product._id, newId: productNewId });

      let newProduct = Object.assign({}, product, {
        _id: productNewId
        // ancestors: product.ancestors.push(product._id)
      });
      delete newProduct.updatedAt;
      delete newProduct.createdAt;
      delete newProduct.publishedAt;
      // todo should we delete position?
      delete newProduct.handle;
      newProduct.isVisible = false;
      if (newProduct.title) {
        // todo test this
        newProduct.title = createTitle(newProduct.title, newProduct._id);
        newProduct.handle = createHandle(
          getSlug(newProduct.title),
          newProduct._id
        );
      }
      result = ReactionCore.Collections.Products.insert(newProduct,
        { validate: false });
      results.push(result);

      // cloning variants
      const variants = ReactionCore.Collections.Products.find({
        ancestors: { $in: [product._id] },
        type: "variant"
      }).fetch();
      // why we are using `_.sortBy` described in `products/cloneVariant`
      const sortedVariants = _.sortBy(variants, doc => doc.ancestors.length);
      for (let variant of sortedVariants) {
        let variantNewId = Random.id();
        setId({ oldId: variant._id, newId: variantNewId });
        let ancestors = buildAncestors(variant.ancestors);
        let newVariant = Object.assign({}, variant, {
          _id: variantNewId,
          ancestors: ancestors
        });
        delete newVariant.updatedAt;
        delete newVariant.createdAt;
        delete newVariant.publishedAt; // TODO can variant have this param?

        result = ReactionCore.Collections.Products.insert(
          newVariant, { validate: false }
        );
        copyMedia(productNewId, variant._id, variantNewId);
        results.push(result);
      }
    }
    return results;
  },

  /**
   * products/createProduct
   * @summary when we create a new product, we create it with an empty variant.
   * all products have a variant with pricing and details
   * @param {Object} [product] - optional product object
   * @return {String} return insert result
   */
  "products/createProduct": function (product) {
    check(product, Match.Optional(Object));
    // must have createProduct permission
    if (!ReactionCore.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    // if a product object was provided
    if (product) {
      product.userId = Meteor.userId();
      return ReactionCore.Collections.Products.insert(product);
    }

    return ReactionCore.Collections.Products.insert({
      type: "simple" // needed for multi-schema
    }, {
      validate: false
    }, (error, result) => {
      // additionally, we want to create a variant to a new product
      if (result) {
        ReactionCore.Collections.Products.insert({
          ancestors: [result],
          price: 0.00,
          title: "",
          type: "variant" // needed for multi-schema
        });
      }
    });
  },

  /**
   * products/deleteProduct
   * @summary delete a product and unlink it from all media
   * @param {String} productId - productId to delete
   * @returns {Number} returns number of removed products
   */
  "products/deleteProduct": function (productId) {
    check(productId, Match.OneOf(Array, String));
    // must have admin permission to delete
    if (!ReactionCore.hasAdminAccess() && !belongsToCurrentUser(productId)) {
      throw new Meteor.Error(403, "Access Denied");
    }

    let productIds;

    if (!Array.isArray(productId)) {
      productIds = [productId];
    } else {
      productIds = productId;
    }
    const productsWithVariants = ReactionCore.Collections.Products.find({
      $or: [{ _id: { $in: productIds }}, { ancestors: { $in: productIds }}]
    }, { fields: { type: 1 }}).fetch();

    const ids = [];
    productsWithVariants.map(doc => {
      ids.push(doc._id);
    });

    const numRemoved = ReactionCore.Collections.Products.remove({
      _id: {
        $in: ids
      }
    });

    if (numRemoved > 0) {
      // we can get removes results only in async way
      ReactionCore.Collections.Media.remove({
        "metadata.productId": {
          $in: ids
        },
        "metadata.variantId": {
          $in: ids
        }
      });
      return numRemoved;
    }
    throw new Meteor.Error(304, "Something goes wrong, nothing was deleted");
  },

  /**
   * products/updateProductField
   * @summary update single product or variant field
   * @param {String} _id - product._id or variant._id to update
   * @param {String} field - key to update
   * @param {*} value - update property value
   * @todo rename it to something like "products/updateField" to  reflect
   * @todo we need to know which type of entity field belongs. For that we could
   * do something like: const type = Products.findOne(_id).type or transmit type
   * as param if it possible
   * latest changes. its used for products and variants
   * @return {Number} returns update result
   */
  "products/updateProductField": function (_id, field, value) {
    check(_id, String);
    check(field, String);
    check(value, Match.OneOf(String, Object, Array, Boolean));
    // must have createProduct permission
    if (!ReactionCore.hasPermission("createProduct") || !belongsToCurrentUser(productId)) {
      throw new Meteor.Error(403, "Access Denied");
    }

    const doc = ReactionCore.Collections.Products.findOne(_id);
    const type = doc.type;
    let stringValue = EJSON.stringify(value);
    let update = EJSON.parse("{\"" + field + "\":" + stringValue + "}");

    return ReactionCore.Collections.Products.update(_id, {
      $set: update
    }, { selector: { type: type } }, (error, result) => {
      if (result && type === "variant" && ~toDenormalize.indexOf(field)) {
        denormalize(doc.ancestors[0], field);
      }
    });
  },

  /**
   * products/updateProductTags
   * @summary method to insert or update tag with hierarchy
   * @param {String} productId - productId
   * @param {String} tagName - tagName
   * @param {String} tagId - tagId
   * @return {Number} return result
   */
  "products/updateProductTags": function (productId, tagName, tagId) {
    check(productId, String);
    check(tagName, String);
    check(tagId, Match.OneOf(String, null));
    // must have createProduct permission
    if (!ReactionCore.hasPermission("createProduct") || !belongsToCurrentUser(productId)) {
      throw new Meteor.Error(403, "Access Denied");
    }
    this.unblock();

    let newTag = {
      slug: getSlug(tagName),
      name: tagName
    };

    let existingTag = ReactionCore.Collections.Tags.findOne({
      name: tagName
    });

    if (existingTag) {
      let productCount = ReactionCore.Collections.Products.find({
        _id: productId,
        hashtags: {
          $in: [existingTag._id]
        }
      }).count();
      if (productCount > 0) {
        throw new Meteor.Error(403, "Existing Tag, Update Denied");
      }
      return ReactionCore.Collections.Products.update(productId, {
        $push: {
          hashtags: existingTag._id
        }
      }, { selector: { type: "simple" } });
    } else if (tagId) {
      return ReactionCore.Collections.Tags.update(tagId, {
        $set: newTag
      });
    }

    newTag.isTopLevel = false;
    newTag.shopId = ReactionCore.getShopId();
    newTag.updatedAt = new Date();
    newTag.createdAt = new Date();
    newTag._id = ReactionCore.Collections.Tags.insert(newTag);
    return ReactionCore.Collections.Products.update(productId, {
      $push: {
        hashtags: newTag._id
      }
    }, { selector: { type: "simple" } });
  },

  /**
   * products/removeProductTag
   * @summary method to remove tag from product
   * @param {String} productId - productId
   * @param {String} tagId - tagId
   * @return {String} return update result
   */
  "products/removeProductTag": function (productId, tagId) {
    check(productId, String);
    check(tagId, String);
    if (!ReactionCore.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    ReactionCore.Collections.Products.update(productId, {
      $pull: {
        hashtags: tagId
      }
    }, { selector: { type: "simple" } });

    let productCount = ReactionCore.Collections.Products.find({
      hashtags: {
        $in: [tagId]
      }
    }).count();

    let relatedTagsCount = ReactionCore.Collections.Tags.find({
      relatedTagIds: {
        $in: [tagId]
      }
    }).count();

    if (productCount === 0 && relatedTagsCount === 0) {
      return ReactionCore.Collections.Tags.remove(tagId);
    }
  },

  /**
   * products/setHandle
   * @summary copy of "products/setHandleTag", but without tag
   * @param {String} productId - productId
   * @returns {String} handle - product handle
   */
  "products/setHandle": function (productId) {
    check(productId, String);
    // must have createProduct permission
    if (!ReactionCore.hasPermission("createProduct") || !belongsToCurrentUser(productId)) {
      throw new Meteor.Error(403, "Access Denied");
    }

    let product = ReactionCore.Collections.Products.findOne(productId);
    let handle = getSlug(product.title);
    handle = createHandle(handle, product._id);
    ReactionCore.Collections.Products.update(product._id, {
      $set: {
        handle: handle,
        type: "simple"
      }
    });

    return handle;
  },

  /**
   * products/setHandleTag
   * @summary set or toggle product handle
   * @param {String} productId - productId
   * @param {String} tagId - tagId
   * @return {String} return update result
   */
  "products/setHandleTag": function (productId, tagId) {
    check(productId, String);
    check(tagId, String);
    // must have createProduct permission
    if (!ReactionCore.hasPermission("createProduct") || !belongsToCurrentUser(productId)) {
      throw new Meteor.Error(403, "Access Denied");
    }

    function getSet(handle) {
      return {
        $set: {
          handle: handle,
          type: "simple"
        }
      };
    }

    let product = ReactionCore.Collections.Products.findOne(productId);
    let tag = ReactionCore.Collections.Tags.findOne(tagId);
    // set handle
    if (product.handle === tag.slug) {
      let handle = getSlug(product.title);
      handle = createHandle(handle, product._id);
      ReactionCore.Collections.Products.update(product._id, getSet(handle));

      return handle;
    }
    // toggle handle
    let existingHandles = ReactionCore.Collections.Products.find({
      handle: tag.slug
    }).fetch();
    // this is needed to take care about product's handle which(product) was
    // previously tagged.
    for (let currentProduct of existingHandles) {
      let currentProductHandle = createHandle(
        getSlug(currentProduct.title),
        currentProduct._id);
      ReactionCore.Collections.Products.update(currentProduct._id,
        getSet(currentProductHandle));
    }
    ReactionCore.Collections.Products.update(product._id, getSet(tag.slug));

    return tag.slug;
  },

  /**
   * products/updateProductPosition
   * @summary update product grid positions
   * @param {String} productId - productId
   * @param {Object} positionData -  an object with tag,position,dimensions
   * @return {Number} collection update returns
   */
  "products/updateProductPosition": function (productId, positionData) {
    check(productId, String);
    check(positionData, Object);

    if (!ReactionCore.hasPermission("createProduct") || !belongsToCurrentUser(productId)) {
      throw new Meteor.Error(403, "Access Denied");
    }
    this.unblock();

    let updateResult;
    let product = ReactionCore.Collections.Products.findOne({
      "_id": productId,
      "positions.tag": positionData.tag
    });

    function addPosition() {
      updateResult = ReactionCore.Collections.Products.update({
        _id: productId
      }, {
        $addToSet: {
          positions: positionData
        },
        $set: {
          updatedAt: new Date(),
          type: "simple" // for multi-schema
        }
      }, function (error) {
        if (error) {
          ReactionCore.Log.warn(error);
          throw new Meteor.Error(403, error);
        }
      });
    }

    function updatePosition() {
      updateResult = ReactionCore.Collections.Products.update({
        "_id": productId,
        "positions.tag": positionData.tag
      }, {
        $set: {
          "positions.$.position": positionData.position,
          "positions.$.pinned": positionData.pinned,
          "positions.$.weight": positionData.weight,
          "positions.$.updatedAt": new Date(),
          "type": "simple" // for multi-schema
        }
      }, function (error) {
        if (error) {
          ReactionCore.Log.warn(error);
          throw new Meteor.Error(403, error);
        }
      });
    }

    if (!product) {
      addPosition();
    } else {
      if (product.positions) {
        updatePosition();
      } else {
        addPosition();
      }
    }

    return updateResult;
  },

  /**
   * products/updateVariantsPosition
   * @description updates top level variant position index
   * @param {Array} sortedVariantIds - array of top level variant `_id`s
   * @since 0.11.0
   * @return {Number} ReactionCore.Collections.Products.update result
   */
  "products/updateVariantsPosition"(sortedVariantIds) {
    check(sortedVariantIds, [String]);
    // TODO: to make this work we need to remove auditArgumentsCheck I suppose
    // new SimpleSchema({
    //   sortedVariantIds: { type: [String] }
    // }).validate({ sortedVariantIds });

    if (!ReactionCore.hasPermission("createProduct")) {
      throw new Meteor.Error(403, "Access Denied");
    }

    sortedVariantIds.forEach((id, index) => {
      ReactionCore.Collections.Products.update(id, {
        $set: { index: index }
      }, { selector: { type: "variant" } }, (error, result) => {
        if (result) {
          ReactionCore.Log.info(
            `Variant ${id} position was updated to index ${index}`
          );
        }
      });
    });
  },

  /**
   * products/updateMetaFields
   * @summary update product metafield
   * @param {String} productId - productId
   * @param {Object} updatedMeta - update object with metadata
   * @param {Object} meta - current meta object
   * @todo should this method works for variants also?
   * @return {Number} collection update result
   */
  "products/updateMetaFields": function (productId, updatedMeta, meta) {
    check(productId, String);
    check(updatedMeta, Object);
    check(meta, Match.OptionalOrNull(Object));
    // must have createProduct permission
    if (!ReactionCore.hasPermission("createProduct") || !belongsToCurrentUser(productId)) {
      throw new Meteor.Error(403, "Access Denied");
    }

    // update existing metadata
    if (meta) {
      return ReactionCore.Collections.Products.update({
        _id: productId,
        metafields: meta
      }, {
        $set: {
          "metafields.$": updatedMeta
        }
      }, { selector: { type: "simple" } });
    }
    // adds metadata
    return ReactionCore.Collections.Products.update({
      _id: productId
    }, {
      $addToSet: {
        metafields: updatedMeta
      }
    }, { selector: { type: "simple" } });
  },

  /**
   * products/publishProduct
   * @summary publish (visibility) of product
   * @todo hook into publishing flow
   * @param {String} productId - productId
   * @return {Boolean} product.isVisible
   */
  "products/publishProduct": function (productId) {
    check(productId, String);
    if (!ReactionCore.hasAdminAccess()) {
      throw new Meteor.Error(403, "Access Denied");
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
        ReactionCore.Log.debug("invalid product visibility ", productId);
        throw new Meteor.Error(403, "Forbidden", "Variant is required");
      }

      if (!variantValidator) {
        ReactionCore.Log.debug("invalid product visibility ", productId);
        throw new Meteor.Error(403, "Forbidden",
          "Some properties are missing.");
      }

      // update product visibility
      ReactionCore.Log.info("toggle product visibility ", product._id, !
        product.isVisible);

      return Boolean(ReactionCore.Collections.Products.update(product._id, {
        $set: {
          isVisible: !product.isVisible
        }
      }, { selector: { type: "simple" } }));
    }
    ReactionCore.Log.debug("invalid product visibility ", productId);
    throw new Meteor.Error(400, "Bad Request");
  },
  /**
   * products/activateProduct
   * @summary owner controlled sctivation of product
   * @param {String} productId - productId
   * @return {String} return
   */
  "products/activateProduct": function (productId) {
    check(productId, String);
    if (!ReactionCore.hasPermission("createProduct") || !belongsToCurrentUser(productId)) {
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
