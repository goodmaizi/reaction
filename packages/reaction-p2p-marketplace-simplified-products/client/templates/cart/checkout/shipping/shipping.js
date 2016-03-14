
Template.flatRateCheckoutShipping.onRendered(
  function() {
    let autoClickFreeShipping = function() {
      if ($("#main > div.checkout > div > div > div.checkout-steps-main > div:nth-child(3)").hasClass("checkout-step-completed")) {
        Meteor.clearInterval(autoClickFreeShippingInterval);
        console.log("removed interval.");
      }
      else {
        $(".checkout-shipping .list-group-item:nth-child(1)").trigger("click");
        console.log("clicked free shipping.");

        //$("#main > div.checkout > div > div > div.checkout-steps-main > div:nth-child(3)").hide();
      }
    }

    let autoClickFreeShippingInterval = Meteor.setInterval(autoClickFreeShipping, 100);
  }
);
