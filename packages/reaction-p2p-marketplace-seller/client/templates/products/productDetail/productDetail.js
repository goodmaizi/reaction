
Template.productDetailMarketplace.replaces("productDetail");

Template.productDetail.events({ // for some strange reason our custom event needs to be speficied on the template that we override. doesn't work with our new template name.
  "click .toggle-product-isActive-link": function (event, template) {
    let errorMsg = "";
    const self = this;
    if (!self.title) {
      errorMsg += `${i18next.t("error.isRequired", { field: i18next.t("productDetailEdit.title") })} `;
      template.$(".title-edit-input").focus();
    }
    const variants = ReactionProduct.getVariants(self._id);
    for (let variant of variants) {
      let index = _.indexOf(variants, variant);
      if (!variant.title) {
        errorMsg += `${i18next.t("error.variantFieldIsRequired", { field: i18next.t("productVariant.title"), number: index + 1 })} `;
      }
      if (!variant.price) {
        errorMsg += `${i18next.t("error.variantFieldIsRequired", { field: i18next.t("productVariant.price"), number: index + 1 })} `;
      }
    }
    if (errorMsg.length > 0) {
      Alerts.inline(errorMsg, "warning", {
        placement: "productManagement",
        i18nKey: "productDetail.errorMsg"
      });
    } else {
      Meteor.call("products/activateProduct", self._id, function (error) {
        if (error) {
          errorMsg = `${i18next.t("error.noProfileAddress")} `;

          return Alerts.inline(errorMsg, "error", {
            placement: "productManagement",
            //id: self._id, // this doesn't work on existing prodcuts?
            i18nKey: "productDetail.errorMsg"
          });
        }
      });
    }
  },
});

Template.registerHelper("belongsToCurrentUser", function (productId) {
  if (_.isArray(productId) === true) {
    productId = productId[0];
  }

  let productBelongingToCurrUser = ReactionCore.Collections.Products.findOne({_id:productId, userId:Meteor.userId()})
  console.log("Template.helpers.belongsToCurrentUser() Product ",productId," belongs to ",Meteor.userId(),"?");
  //console.log("Template.helpers.belongsToCurrentUser() productBelongingToCurrUser ",productBelongingToCurrUser);
  return productBelongingToCurrUser != null;
});
