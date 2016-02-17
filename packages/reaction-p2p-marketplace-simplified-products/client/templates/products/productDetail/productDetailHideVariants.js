
Template.productDetailHideVariants.inheritsHelpersFrom("productDetail");
Template.productDetailHideVariants.inheritsEventsFrom("productDetail");
Template.productDetailHideVariants.inheritsHooksFrom("productDetail");

Template.productDetail.rendered = function() {

  console.log("wakka!");
  // auto-select variant
  $('.variant-detail').click();
  console.log("selected variant");

  // hide variant
  //$('.variant-list-item').hide();
  console.log("hid variant");
};
