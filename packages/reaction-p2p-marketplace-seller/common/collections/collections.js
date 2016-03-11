/**
* Collections Templates
*/

// overriding Products collection set by reaction core
ReactionCore.Collections.Products.attachSchema(ReactionCore.Schemas.Product, {selector: { type: "simple" }, replace: true});

ReactionCore.Collections.Accounts.attachSchema(ReactionCore.Schemas.Accounts, {replace: true});
