
ReactionRouter.route('/profile/:userId', {
  action: function(params) {
    console.log("userId: ",params.userId);
    BlazeLayout.render("coreLayout", {template: "marketplaceProfile", params: params, data: {userId: params.userId}}); // , {content: "blogHome"}
  }
});
/*
ReactionRouter.route('/reaction/products', {
  action: function() {
    BlazeLayout.render("coreLayout");
  }
});
ReactionRouter.route('/products', {
  action: function() {
    //BlazeLayout.render("products");
    //renderLayout();
    BlazeLayout.render("coreLayout", "coreWorkflow");
  }
});
ReactionRouter.route('/productGrid', {
  action: function() {
    BlazeLayout.render("productGrid");
  }
});*/
