
Template.productDetail.onRendered(
  function() {
    // buyer
    if (!ReactionCore.hasPermission("createProduct")) {
      // auto-select variant
      $('.variant-detail .variant-title').click();
      console.log("auto selected variant");

      // hide variant
      $('.variant-list-item').hide();
      console.log("hid variant");
    }
    // seller
    else {
      //var productTitle = $('.title-edit-input').val();
      $('.variant-edit-form [name=title]').val("Variante 1");
      $('.variant-edit-form [name=weight]').val('1');
      if ($('.variant-edit-form [name=inventoryQuantity]').val() == '') {
        $('.variant-edit-form [name=inventoryQuantity]').val('1');
      }
      $('.variant-edit-form [name=compareAtPrice]').val('1');
      // don't prefill price, so user is forced to change a field, which in turn saves the variant
      //if ($('.variant-edit-form [name=price]').val() == '0') {
      //  $('.variant-edit-form [name=price]').val('8.90');
      //}

      $('.variant-edit-form [name=title]').focus();
      $('.variant-edit-form [name=title]').blur();

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
      $('.pageTitle-edit-input').hide();
      $('#price').hide();

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
  }
);

/*
Template.productDetailHideVariants.events({
  "blur .title-edit-input": function () {
      var productTitle = $('.title-edit-input').val();
      $('.variant-edit-form [name=title]').val(productTitle);
    }
  }
);*/
