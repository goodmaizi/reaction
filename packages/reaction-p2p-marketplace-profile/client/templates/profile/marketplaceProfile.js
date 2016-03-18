
Template.marketplaceProfile.helpers(
  {
    getProfileAccount: function(userId) {
      ReactionCore.Subscriptions.ProfileAccount = ReactionSubscriptions.subscribe("ProfileAccount", userId);
      if (ReactionCore.Subscriptions.ProfileAccount.ready()) {
        let profileAccount = ReactionCore.Collections.Accounts.findOne({_id: userId});
        console.log("profileAccount: %o",profileAccount);

        return {profileAccount: profileAccount};
      }
    },
    getProfileUser: function(userId) {
      ReactionCore.Subscriptions.ProfileUser = ReactionSubscriptions.subscribe("ProfileUser", userId);
      if (ReactionCore.Subscriptions.ProfileUser.ready()) {
        let profileUser = Meteor.users.findOne({_id: userId});

        return profileUser;
      }
    },

  }
);
