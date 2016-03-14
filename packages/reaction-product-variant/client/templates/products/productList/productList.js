/**
 * productList helpers
 */

let Media;
Media = ReactionCore.Collections.Media;
Template.productList.helpers({
  products: function () {
    return ReactionProduct.getProductsByTag(this.tag);
  },
  media: function () {
    const media = ReactionCore.Collections.Media.findOne({
      "metadata.productId": this._id,
      "metadata.priority": 0,
      "metadata.toGrid": 1
    }, { sort: { uploadedAt: 1 } });

    return media instanceof FS.File ? media : false;
  },
});
