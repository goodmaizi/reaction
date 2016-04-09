
Template.marketplaceUserDecision.events(
  {
    "click .login-input-isSeller": function (event, template)
    {
      console.log("seller desu!");
      Meteor.call("accounts/userDecide", true);
      ReactionRouter.go("/");
    },
    "click .login-input-isBuyer": function (event, template)
    {
      console.log("buyer desu!");
      Meteor.call("accounts/userDecide", false);
      ReactionRouter.go("/");
    },
  }
);
