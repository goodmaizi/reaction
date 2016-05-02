
Template.dashboardProductsList.inheritsHelpersFrom("productList"); // for media
Template.dashboardProductsList.inheritsHooksFrom("productList"); // needed to make products show up
Template.dashboardProductsList.inheritsHelpersFrom("gridContent"); // for price

Template.dashboardProductsList.helpers({
  products: function (data) { // override to show only this users products
    let SellerProducts = Meteor.subscribe("SellerProducts");
    if (SellerProducts.ready()) {
      //console.log("helper Template.dashboardProductsList.helpers using publication SellerProducts.");
      return ReactionCore.Collections.Products.find({userId: Meteor.userId()});
    }
  },
});

Template.dashboardProductsList.events({
  "click .btn-add-product": function (event, template) {
    event.preventDefault();
    event.stopPropagation();

    Meteor.call("products/createProduct", (error, productId) => {
      let currentTag;
      let currentTagId;

      if (error) {
        throw new Meteor.Error("createProduct error", error);
      } else if (productId) {
        currentTagId = Session.get("currentTag");
        currentTag = ReactionCore.Collections.Tags.findOne(currentTagId);
        if (currentTag) {
          Meteor.call("products/updateProductTags", productId, currentTag.name, currentTagId);
        }
        ReactionRouter.go("product", {
          handle: productId
        });
      }
    });
    template.$(".dropdown-toggle").dropdown("toggle");
  }
});

Template.dashboardProductsList.onCreated(function() {
  let SellerProducts = Meteor.subscribe("SellerProducts");
  this.autorun(() => {
    if (SellerProducts.ready()) {
        // delete products with no title, description and image
        let products = ReactionCore.Collections.Products.find({userId: Meteor.userId()}).fetch();
        console.log("products: ",products);

        for (let product of products) {
          let productId = product._id;
          let media = ReactionCore.Collections.Media.findOne({
            "metadata.productId": product._id,
            "metadata.priority": 0,
            "metadata.toGrid": 1
          }, { sort: { uploadedAt: 1 } });
          console.log("product media: ",media);

          if ( (product.title == null || product.title == "")
              && (product.description == null || product.description == "")
              && media == null) {
            console.log("delete empty product!");
            ReactionCore.Collections.Products.remove({_id: product._id});
          }
        }
    }
  });
});
