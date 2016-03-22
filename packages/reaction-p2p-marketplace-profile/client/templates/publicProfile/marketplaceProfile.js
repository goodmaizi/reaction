Template.marketplaceProfile.onCreated(function () {
  this.userId = () => ReactionRouter.getParam("userId");
  /*
  this.autorun(() => {
    this.subscribe("Product", this.productId());
    this.subscribe("Tags");
  });
  */
});

Template.marketplaceProfile.helpers(
  {
    getProfileAccount: function(userId) {
      const instance = Template.instance();
      if (instance.userId()) {
        userId = instance.userId();
      }
      ReactionCore.Subscriptions.ProfileAccount = ReactionSubscriptions.subscribe("ProfileAccount", userId);
      if (ReactionCore.Subscriptions.ProfileAccount.ready()) {
        let profileAccount = ReactionCore.Collections.Accounts.findOne({_id: userId});
        console.log("profileAccount: %o",profileAccount);

        return {profileAccount: profileAccount};
      }
    },
    getProfileUser: function(userId) {
      const instance = Template.instance();
      if (instance.userId()) {
        userId = instance.userId();
      }
      ReactionCore.Subscriptions.ProfileUser = ReactionSubscriptions.subscribe("ProfileUser", userId);
      if (ReactionCore.Subscriptions.ProfileUser.ready()) {
        let profileUser = Meteor.users.findOne({_id: userId});

        return profileUser;
      }
    },

  }
);

Template.registerHelper("getProfileUrl", function (userId) {
  const instance = Template.instance();
  if (instance.subscriptionsReady()) {
    console.log("Template.registerHelper(getProfileUrl) ",userId);
    return "/reaction/profile/"+userId;
  }
});
