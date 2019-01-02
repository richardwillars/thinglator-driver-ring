const RingApi = require("ring-api");
const driver = require("./driver");

module.exports = {
  initialise: (settings, updateSettings, commsInterface, events, createEvent) =>
    driver(
      settings,
      updateSettings,
      commsInterface,
      RingApi,
      events,
      createEvent
    ),
  driverType: "doorbell",
  interface: "http",
  driverId: "thinglator-driver-ring"
};
