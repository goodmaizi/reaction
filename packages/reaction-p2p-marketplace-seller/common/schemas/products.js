
// overriding product schema with extended version
ReactionCore.Schemas.Product = new SimpleSchema([
  ReactionCore.Schemas.Product, {
    userId: {
      type: String,
      index: 1
    },
    isActive: {
      type: Boolean,
      index: 1,
      defaultValue: false
    },
  }
]);
