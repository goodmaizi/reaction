
Template.dashboardProductsList.inheritsHelpersFrom("productGrid");
Template.dashboardProductsList.inheritsEventsFrom("productGrid");
Template.dashboardProductsList.inheritsHooksFrom("productGrid");

/**
 * dashboardProductsList helpers
 *
 */
 /*
Template.dashboardProductsList.helpers({
  products: function (data) {
    console.log("products: sreaching products for use "+Meteor.userId());
    if (data.hash.data) {
      return data.hash.data;
    }
    var productsFound = ReactionCore.Collections.Products.find({userId: Meteor.userId()}, {
      sort: {
        createdAt: -1
      },
      limit: 25
    });

    // copied
    //let gridProducts = ReactionCore.Collections.Products.find({}).fetch();
    let gridProducts = ReactionCore.Collections.Products.find({});

    console.log("gridProducts: %o", gridProducts);
    //const products = gridProducts.sort(compare);
    Template.instance().products = gridProducts;
    return gridProducts;
    // /copied

    console.log("products: %o", productsFound);
    return productsFound;
  },
  shopName: function () {
    let shop = ReactionCore.Collections.Shops.findOne(this.shopId);
    return shop !== null ? shop.name : void 0;
  }
});
*/
