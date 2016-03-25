
ReactionCore.Hooks.Events.add(
  "onCreateUser",
  function(user, options) {
    ReactionCore.Log.info("ReactionCore.Hooks.Events -> onCreateUser options: "+options);
    const shop = ReactionCore.getCurrentShop();
    const shopId = shop._id;

    ReactionCore.Log.info("Adding profile permissions.");

    user.roles[shopId].push("/profile/:userId");
    //user.roles[shopId].push("profile/:userId");
    user.roles[shopId].push("marketplaceProfile");

    return user;
  }
);
