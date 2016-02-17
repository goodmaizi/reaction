
Template.productDetailHideVariants.inheritsHelpersFrom("productDetail");
Template.productDetailHideVariants.inheritsEventsFrom("productDetail");
Template.productDetailHideVariants.inheritsHooksFrom("productDetail");

Template.productDetail.rendered = function() {
  if (!ReactionCore.hasPermission("createProduct")) {
    // auto-select variant
    $('.variant-detail .variant-title').click();
    console.log("auto selected variant");

    // hide variant
    $('.variant-list-item').hide();
    console.log("hid variant");
  }
  else {
    var productTitle = $('.title-edit-input').val();
    $('.variant-edit-form [name=title]').val(productTitle);
    $('.variant-edit-form [name=weight]').val('1');

    // click variant edit for seller to see

    // check if it's already open
    $('.variant-edit').click();
    console.log("clicked variant edit");

    // prevent second variant
    $('.variant-form-buttons').hide();
    console.log("hid variant edit buttons");
  }
};
