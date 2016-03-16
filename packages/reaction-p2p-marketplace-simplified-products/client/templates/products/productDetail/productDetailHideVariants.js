
Template.productDetail.onRendered(
  function() {
    let simplifyProductPageInterval = Meteor.setInterval(function(){
      // buyer
      if (!ReactionCore.hasPermission("createProduct")) {

        $('.product-detail-field.pageTitle').hide();

        // auto-select variant
        $('.variant-detail .variant-title').click();
        console.log("auto selected variant");

        // hide variant
        $('.variant-list-item').hide();
        console.log("hid variant");

        // make sure the changes were applied, then stop this interval
        if (!$('.variant-list-item').is(":visible")) {
          console.log("cleared simplifyProductPageInterval interval");
          Meteor.clearInterval(simplifyProductPageInterval);
        }
      }
      // seller
      else {
        //var productTitle = $('.title-edit-input').val();
        //$('.variant-edit-form [name=title]').val("Variante 1");

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

        // hide some variant fields
        $('.variant-edit-form .form-group').each(
          function(index, element) {
            if (index == 2 || index == 4) {
              $(this).show();
            }
            else {
              //$(this).hide();
            }
          }
        );

        $('.add-to-cart-block').hide();

        // make sure the changes were applied, then stop this interval
        if (!$('.add-to-cart-block').is(":visible")) {
          console.log("cleared simplifyProductPageInterval interval");
          Meteor.clearInterval(simplifyProductPageInterval);
        }
      }

      // hide title "Options"
      $('.options-add-to-cart h3').hide();

      // hide product details fields
      $('h3[data-i18n="productDetail.details"]').hide();
      $('.pdp-left-column ul.list-group.product-detail-edit').hide();
      console.log("hid details list");

    }, 100);
  }
);

/*
Template.productDetail.events({
    "change .title-edit-input": function () {
      var productTitle = $('.title-edit-input').val();
      $('.variant-edit-form [name=title]').val(productTitle);
      console.log("on change: updated variant title on %o: ",$('.variant-edit-form [name=title]'));
      $('.variant-edit-form [name=title]').blur();
    }
  }
);*/
