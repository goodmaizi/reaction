ReactionCore.Schemas.ProductDate = new SimpleSchema([
  ReactionCore.Schemas.Product, {
    "forSaleOnDate": {
      type: Date,
      //defaultValue: true,
      optional: false
    },
  }
]);
