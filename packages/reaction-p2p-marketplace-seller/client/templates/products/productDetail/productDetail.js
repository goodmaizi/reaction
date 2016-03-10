
Template.productDetailMarketplace.replaces("productDetail");

Template.productDetail.events({ // for some strange reason our custom event needs to be speficied on the template that we override. doesn't work with our new template name.
  "click .toggle-product-isActive-link": function (event, template) {
    let errorMsg = "";
    const self = this;
    if (!self.title) {
      errorMsg += "Product title is required. ";
      template.$(".title-edit-input").focus();
    }
    let variants = self.variants;
    for (let variant of variants) {
      let index = _.indexOf(variants, variant);
      if (!variant.title) {
        errorMsg += "Variant " + (index + 1) + " label is required. ";
      }
      if (!variant.price) {
        errorMsg += "Variant " + (index + 1) + " price is required. ";
      }
    }
    if (errorMsg.length > 0) {
      Alerts.add(errorMsg, "danger", {
        placement: "productManagement",
        i18nKey: "productDetail.errorMsg"
      });
    } else {
      Meteor.call("products/activateProduct", self._id, function (error) {
        if (error) {
          return Alerts.add(error.reason, "danger", {
            placement: "productManagement",
            //id: self._id, // this doesn't work on existing prodcuts?
            i18nKey: "productDetail.errorMsg"
          });
        }
      });
    }
  },
});
