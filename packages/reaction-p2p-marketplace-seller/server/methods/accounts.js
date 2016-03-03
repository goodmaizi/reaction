
//Accounts.onCreateUser(function (options, user) {
ReactionCore.MethodHooks.after('accounts/onCreateUser', function(user, options){
  ReactionCore.Log.info("Adding permission: account/seller/products");
  Meteor.call("accounts/addUserPermissions", this.userId, ["guest", "account/seller/products"], this.shopId);

  return user;
}
);

ReactionCore.MethodHooks.before('accounts/onCreateUser', function(user, options){
  ReactionCore.Log.info("Adding permission: account/seller/products");
  Meteor.call("accounts/addUserPermissions", this.userId, ["guest", "account/seller/products"], this.shopId);

  return user;
}
);


ReactionCore.MethodHooks.before('accounts/onCreateUser', function(options){
  ReactionCore.Log.info("Adding permission: account/seller/products");
  Meteor.call("accounts/addUserPermissions", this.userId, ["guest", "account/seller/products"], this.shopId);

  return user;
}
);

ReactionCore.MethodHooks.before('onCreateUser', function(user, options){
  ReactionCore.Log.info("Adding permission: account/seller/products");
  Meteor.call("accounts/addUserPermissions", this.userId, ["guest", "account/seller/products"], this.shopId);

  return user;
}
);

ReactionCore.MethodHooks.before('onCreateUser', function(options){
  ReactionCore.Log.info("Adding permission: account/seller/products");
  Meteor.call("accounts/addUserPermissions", this.userId, ["guest", "account/seller/products"], this.shopId);

  return user;
}
);
