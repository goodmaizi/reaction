
// inherit helpers from template productDetail so we can use fieldComponent in this here template

Template.productDetailDateField.inheritsHelpersFrom(["productDetail", "productDetailEdit"]);
Template.productDetailDateField.inheritsEventsFrom(["productDetail", "productDetailEdit"]);
Template.productDetailDateField.inheritsHooksFrom(["productDetail", "productDetailEdit"]);

Template.productDetailDateField.onRendered(
  function() {
    Meteor.setTimeout(function() { // what the?!? document doesn't seem to be ready immediately when this event is fired...
      $(".forSaleOnDate-edit-input").datepicker({
        format: "dd.mm.yyyy"
      });
      console.log("activated datepicker");
    }, 100);
  }
);
