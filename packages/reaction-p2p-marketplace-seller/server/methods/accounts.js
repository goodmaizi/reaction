
ReactionCore.Hooks.Events.add(
  "onCreateUser",
  function(user, options) {
    const shop = ReactionCore.getCurrentShop();
    const shopId = shop._id;

    if (options.isSeller != null && options.isSeller === true) {
      ReactionCore.Log.info("Adding seller permissions.");

      user.roles[shopId].push("createProduct");
      user.roles[shopId].push("account/seller/products"); // for access to our own products route
      user.roles[shopId].push("account/seller/orders"); // for access to our own orders route
      user.roles[shopId].push("reaction-orders"); // for access on orders collection
      user.roles[shopId].push("orders"); // for access on orders collection
      user.roles[shopId].push("dashboard/orders"); // for access to existing AND our own orders route
    }

    return user;
  }
);
