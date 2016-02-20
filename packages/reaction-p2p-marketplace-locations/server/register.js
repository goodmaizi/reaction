
ReactionCore.registerPackage({
  label: "Locations",
  name: "reaction-p2p-marketplace-locations",
  icon: "fa fa-map",
  autoEnable: true,
  settings: {
    /*
    public: {
      allowGuestCheckout: true
    },
    mail: {
      user: "",
      password: "",
      host: "localhost",
      port: "25"
    },
    openexchangerates: {
      appId: "",
      refreshPeriod: "every 1 hour"
    }*/
  },
  registry: [{
      route: "/dashboard/locations",
      provides: "dashboard",
      label: "Locations",
      description: "Locations for products and sellers",
      icon: "fa fa-map",
      cycle: "4",
      container: "dashboard",
    }, {
      route: "/dashboard/locations",
      template: "locationsSettings",
      label: "Locations Settings",
      provides: "settings",
      icon: "fa fa-cog fa-2x fa-fw",
      container: "dashboard"
    }, {
      template: "reactionLocations",
      provides: "locations"
  }],
  permissions: [
    {
      label: "Locations",
      permission: "dashboard/locations",
      group: "Locations Settings"
    }
  ]
});
