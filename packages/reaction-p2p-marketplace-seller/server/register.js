
ReactionCore.registerPackage({
  label: "Marketplace Seller",
  name: "reaction-p2p-marketplace-seller",
  icon: "fa fa-map",
  autoEnable: true,
  settings: {},
  registry: [
    {
      route: "/account/seller/products",
      template: "dashboardProductsList",
      name: "account/seller/products",
      label: "My Products",
      icon: "fa fa-user",
      provides: "userAccountDropdown"
    },
    {
      route: "/account/seller/sellerorders",
      template: "sellerOrders",
      name: "account/seller/sellerorders",
      label: "My Orders",
      icon: "fa fa-dropbox",
      provides: "userAccountDropdown",
      permissions: [
        {
          label: "Seller Orders",
          permission: "account/seller/sellerorders"
        },
      ]
    },
  ],
});
