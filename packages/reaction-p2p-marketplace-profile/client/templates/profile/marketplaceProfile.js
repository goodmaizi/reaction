
Template.marketplaceProfile.onRendered(
  function() {
    /*
    Meteor.setTimeout(function() {
      var selector = "#main .container-lg";
      console.log('injecting products list into: '+$(selector)[0]);
      Blaze.renderWithData(Template.dashboardProductsList, this.data, $(selector)[0])
      //Blaze.renderWithData(Template.productList, this.data, $(selector)[0]) // trying to use the list from core

      console.log('injected products list');
    }, 100);
    */
  }
);

Template.marketplaceProfile.helpers(
  {
    profileUser: function(userId) {
      let profileUser = ReactionCore.Collections.Accounts.findOne({userId: userId});
      console.log("profileUser: %o",profileUser);

      return profileUser;
    }
  }
);
