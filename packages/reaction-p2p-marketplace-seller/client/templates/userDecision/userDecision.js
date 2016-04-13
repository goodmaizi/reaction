
Template.marketplaceUserDecision.events(
  {
    "click .login-input-isSeller": function (event, template)
    {
      console.log("seller desu!");
      Meteor.call("accounts/userDecide", true, function(error, result) {
        $('#main').fadeOut();
        window.location.reload(true); // this is necessary to ensure users new permissions are in effect


        /* // this doesn't work, even with timeout
        Meteor.setTimeout(function(){
          ReactionRouter.go("/");
        }, 500);*/
      });

    },
    "click .login-input-isBuyer": function (event, template)
    {
      console.log("buyer desu!");
      Meteor.call("accounts/userDecide", false, function(error, result) {
        ReactionRouter.go("/");
      });
    },
  }
);
