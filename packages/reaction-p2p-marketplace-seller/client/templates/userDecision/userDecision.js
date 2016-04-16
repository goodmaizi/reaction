
function checkTermsAndConditions() {
  if ($('.login-input-acceptedTerms').prop('checked') == true) {
    console.log("terms accepted");
    return true;
  }
  else {
    console.log("terms not accepted!");
    Alerts.inline(i18next.t('accountsUI.error.mustAcceptTerms', {defaultValue: "You must accept the terms and conditions"}), "error", {
      placement: "terms",
      //i18nKey: "productDetail.outOfStock",
      autoHide: 10000
    });
  }

}

Template.marketplaceUserDecision.events(
  {
    "click .login-input-acceptedTerms": function (event, template)
    {
      if ($('.login-input-acceptedTerms').prop('checked') == true) {
        $('.terms-block').hide();
        $('.decision-block').fadeIn();
      }
    },
    "click .login-input-isSeller": function (event, template)
    {
      if (checkTermsAndConditions()) {
        console.log("seller desu!");
        let acceptedTerms = $('.login-input-acceptedTerms').prop('checked');
        
        Meteor.call("accounts/userDecide", true, acceptedTerms, function(error, result) {
          $('#main').css("visibility", "hidden");
          window.location.reload(true); // this is necessary to ensure users new permissions are in effect

          //ReactionRouter.reload(); // doesn't help
          //ReactionRouter.go("/");

          /* // this doesn't work, even with timeout
          Meteor.setTimeout(function(){
            ReactionRouter.go("/");
          }, 500);*/
        });
      }
      else {
        $('.login-input-isSeller').prop('checked', false);
      }
    },
    "click .login-input-isBuyer": function (event, template)
    {
      if (checkTermsAndConditions()) {
        console.log("buyer desu!");
        let acceptedTerms = $('.login-input-acceptedTerms').prop('checked');

        Meteor.call("accounts/userDecide", false, acceptedTerms, function(error, result) {
          ReactionRouter.go("/");
        });
      }
      else {
        $('.login-input-isBuyer').prop('checked', false);
      }
    },
  }
);
