
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
    $('.variant-edit-form [name=inventoryQuantity]').val('1');
    $('.variant-edit-form [name=price]').val('1');

    // click variant edit for seller to see

    // check if it's already open
    if ($('.variant-edit-form').hasClass('hidden')) {
      $('.variant-edit').click();
      console.log("clicked variant edit");
    }

    $('.variant-detail').hide();

    // prevent second variant
    $('.variant-form-buttons').hide();
    $('.variant-options').hide();
    console.log("hid variant extra stuff");

    // hide unneeded fields
    $('.vendor-edit-input').hide();

    $('.variant-edit-form .form-group').each(
      function(index, element) {
        if (index == 2 || index == 4) {
          $(this).show();
        }
        else {
          $(this).hide();
        }
      }
    );

    $('.add-to-cart-block').hide();
  }

  // hide title "Options"
  $('.options-add-to-cart h3').hide();
};
