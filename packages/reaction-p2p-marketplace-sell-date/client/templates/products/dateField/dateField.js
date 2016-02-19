
// inherit helpers from template productDetail so we can use fieldComponent in this here template
Template.productDetailDateField.inheritsHelpersFrom("productDetail");
Template.productDetailDateField.inheritsEventsFrom("productDetail");
Template.productDetailDateField.inheritsHooksFrom("productDetail");

Template.productDetailDateField.onRendered(
  function() {
    $(".forSaleOnDate-edit-input").datepicker();
  }
);
