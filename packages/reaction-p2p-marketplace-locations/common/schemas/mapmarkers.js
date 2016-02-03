/**
 * Map Marker Schema
 */

ReactionCore.Schemas.MapMarker = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  productId: {
    type: String,
    optional: false,
    defaultValue: ""
  },
  shopId: {
    type: String,
    autoValue: ReactionCore.shopIdAutoValue,
    index: 1,
    label: "Product ShopId"
  },
  latitude: {
    type: String,
    defaultValue: "0"
  },
  longitude: {
    type: String,
    defaultValue: "0"
  },
});
