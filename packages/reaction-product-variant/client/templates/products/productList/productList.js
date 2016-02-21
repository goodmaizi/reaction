/**
 * productList helpers
 */

let Media;
Media = ReactionCore.Collections.Media;
Template.productList.helpers({
  products: function () {
    /*
     * take natural sort, sorting by updatedAt
     * then resort using positions.position for this tag
     * retaining natural sort of untouched items
     */

    // function to compare and sort position
    function compare(a, b) {
      if (a.position.position === b.position.position) {
        let x = a.position.updatedAt;
        let y = b.position.updatedAt;

        if (x > y) {
          return -1;
        } else if (x < y) {
          return 1;
        }

        return 0;
      }
      return a.position.position - b.position.position;
    }

    let gridProducts = ReactionCore.Collections.Products.find({}).fetch();

    for (let index in gridProducts) {
      if ({}.hasOwnProperty.call(gridProducts, index)) {
        let gridProduct = gridProducts[index];
        if (gridProduct.positions) {
          let _results = [];
          for (let position of gridProduct.positions) {
            if (position.tag === ReactionCore.getCurrentTag()) {
              _results.push(position);
            }
            gridProducts[index].position = _results[0];
          }
        }
        if (!gridProduct.position) {
          gridProducts[index].position = {
            position: 0,
            weight: 0,
            pinned: false,
            updatedAt: gridProduct.updatedAt
          };
        }
      }
    }

    const products = gridProducts.sort(compare);
    Template.instance().products = products;
    return products;
  },
  media: function () {
    let defaultImage;
    let variants = [];
    for (let variant of this.variants) {
      if (!variant.parentId) {
        variants.push(variant);
      }
    }
    if (variants.length > 0) {
      let variantId = variants[0]._id;
      defaultImage = Media.findOne({
        "metadata.variantId": variantId,
        "metadata.priority": 0
      });
    }
    if (defaultImage) {
      return defaultImage;
    }
    return false;
  }
});
