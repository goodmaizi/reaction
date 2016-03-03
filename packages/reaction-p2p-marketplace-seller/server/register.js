
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
      route: "/account/seller/orders",
      template: "sellerOrders",
      name: "account/seller/orders",
      label: "My Orders",
      icon: "fa fa-user",
      provides: "userAccountDropdown"
    },
  ],
  /*
  permissions: [
    {
      label: "Locations",
      permission: "dashboard/locations",
      group: "Locations Settings"
    }
  ]*/
});
