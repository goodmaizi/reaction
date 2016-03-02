
Template.flatRateCheckoutShipping.onRendered(
  function() {
    Meteor.setTimeout(function() {
      $(".checkout-shipping .list-group-item:nth-child(1)").trigger("click");
      console.log("clicked free shipping.");

      $("#main > div.checkout > div > div > div.checkout-steps-main > div:nth-child(3)").hide();
    }, 100);
  }
);
