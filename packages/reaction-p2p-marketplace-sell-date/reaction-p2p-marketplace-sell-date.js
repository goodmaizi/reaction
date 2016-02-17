// Write your package code here!

/*
Template.productDetail.rendered = function() {
  // inject date field template here?
  Blaze.renderWithData(Template.someTemplate, {my: "data"}, $("#parrent-node")[0])
};
*/

/*
Template.productDetail.events({
  "click #price": function () {
    let formName;
    if (ReactionCore.hasPermission("createProduct")) {
      let variant = selectedVariant();
      if (!variant) {
        return;
      }

      if (variant.parentId) {
        formName = variant.parentId;
      } else {
        formName = variant._id;
      }

      formName = "variant-form-" + formName;
      Session.set(formName, true);
      $(`#${formName}[name="price"]`).focus();
    }
  }
);*/
