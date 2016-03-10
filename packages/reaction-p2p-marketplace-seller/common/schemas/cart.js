
// overriding CartItem schema with extended version
ReactionCore.Schemas.CartItem = new SimpleSchema([
  ReactionCore.Schemas.CartItem, {
    sellerId: {
      type: String,
      index: 1
    },
  }
]);
