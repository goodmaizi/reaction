var LocationsApp;

LocationsApp = {
  "profilePage": "",
  "enabled": false
};

ReactionCore.registerPackage({
  label: "Locations",
  name: "reaction-p2p-marketplace-locations",
  icon: "fa fa-map",
  autoEnable: true,
  settings: {
    "public": {
      autoInit: true,
      apps: {
        "facebook": _.extend({
          "appId": void 0,
          "version": "v2.1"
        }, LocationsApp),
        "twitter": _.extend({
          "username": void 0
        }, LocationsApp),
        "googleplus": _.extend({}, LocationsApp),
        "pinterest": _.extend({}, LocationsApp)
      },
      appsOrder: ["facebook", "twitter", "pinterest", "googleplus"],
      iconOnly: true,
      faSize: "fa-2x",
      faClass: "square",
      targetWindow: "_self"
    }
  },
  registry: [
    {
      provides: "dashboard",
      label: "Locations",
      description: "Locations for sellers and products",
      route: "dashboard/locations",
      icon: "fa fa-map",
      cycle: "4",
      container: "dashboard"
    }, {
      label: "Locations Settings",
      route: "dashboard/locations",
      template: "locationsDashboard",
      provides: "settings",
      template: "locationsSettings"
    }, {
      template: "reactionLocations",
      provides: "locations"
    }
  ],
  permissions: [
    {
      label: "Locations",
      permission: "dashboard/locations",
      group: "Shop Settings"
    }
  ]
});
