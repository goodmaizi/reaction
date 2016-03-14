
ReactionCore.Hooks.Events.add(
  "onCreateUser",
  function(user, options) {
    ReactionCore.Log.info("ReactionCore.Hooks.Events -> onCreateUser options: "+options);
    const shop = ReactionCore.getCurrentShop();
    const shopId = shop._id;

    if (options.isSeller != null && options.isSeller === true) {
      ReactionCore.Log.info("Adding seller permissions.");

      user.roles[shopId].push("createProduct");
      user.roles[shopId].push("account/seller/products"); // for access to our own products route
      user.roles[shopId].push("account/seller/sellerorders"); // for access to our own orders route

      // add additional data
      user.isSeller = options.isSeller;
    }

    // doing this not only for sellers. buyers have a name on their profile too.
    user.profile = options.profile;

    return user;
  }
);
