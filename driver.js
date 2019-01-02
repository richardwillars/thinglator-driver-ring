let ringApi;
const deviceIdCache = {};

const initDevices = async devices => {
  console.log("init");
  console.log(devices);
  devices.forEach(device => {
    deviceIdCache[String(device.originalId)] = device.deviceId;
  });
};

const logActivity = (event, createEvent, events) => {
  console.log("there is an event", event, events);
  let deviceId;
  if (event.doorbot_id) {
    deviceId = deviceIdCache[String(event.doorbot_id)];
  }
  console.log("a");
  if (deviceId) {
    console.log("b");
    if (event.state === "ringing" && event.motion === true) {
      console.log("c");
      createEvent(events.MOTION, deviceId, {
        detected: true
      });
    } else if (event.state === "ringing" && event.motion === false) {
      console.log("d");
      createEvent(events.BUTTON, deviceId, {
        pressed: true
      });
    }
  }
};

const discover = async events => {
  try {
    const devices = await ringApi.devices();
    return devices.doorbells.map(doorbell => ({
      originalId: doorbell.id,
      name: doorbell.description,
      commands: {},
      events: {
        [events.MOTION]: !!doorbell.features.motions_enabled,
        [events.BUTTON]: true
      }
    }));
  } catch (err) {
    const error = err;
    error.type = "Authentication";
    throw error;
  }
};

const getAuthenticationProcess = () => [
  {
    type: "RequestData",
    message:
      "In order to use Ring doorbells you must provide your ring.com login details", // eslint-disable-line max-len
    dataLabel: "Email address"
  },
  {
    type: "RequestData",
    message:
      "In order to use Ring doorbells you must provide your ring.com login details", // eslint-disable-line max-len
    dataLabel: "Password"
  }
];

const authenticationStep0 = async (props, updateSettings, events) => {
  const newSettings = {
    email: props.data
  };
  try {
    await updateSettings(newSettings);
    return {
      success: true,
      message: "Authenticated"
    };
  } catch (err) {
    return {
      success: false,
      message: err.error || err.message
    };
  }
};

const authenticationStep1 = async (
  props,
  updateSettings,
  events,
  getSettings,
  RingApi,
  createEvent
) => {
  const newSettings = {
    password: props.data
  };
  try {
    await updateSettings(newSettings);
    const settings = await getSettings();
    try {
      ringApi = await RingApi({
        email: settings.email,
        password: settings.password,
        poll: true
      });
      // check if the token is valid by calling discover
      await discover(events);
      ringApi.events.on("activity", event => {
        logActivity(event, createEvent, events);
      });
    } catch (err) {
      console.error(err);
    }

    return {
      success: true,
      message: "Authenticated"
    };
  } catch (err) {
    return {
      success: false,
      message: err.error || err.message
    };
  }
};

module.exports = async (
  getSettings,
  updateSettings,
  commsInterface,
  RingApi,
  events,
  createEvent
) => {
  const settings = await getSettings();
  if (settings.email && settings.password) {
    try {
      ringApi = await RingApi({
        email: settings.email,
        password: settings.password,
        poll: true
      });
      ringApi.events.on("activity", event => {
        logActivity(event, createEvent, events);
      });
    } catch (err) {
      console.error(err);
    }
  }

  return {
    initDevices: devices => initDevices(devices),
    authentication_getSteps: getAuthenticationProcess,
    authentication_step0: props =>
      authenticationStep0(props, updateSettings, events),
    authentication_step1: props =>
      authenticationStep1(
        props,
        updateSettings,
        events,
        getSettings,
        RingApi,
        createEvent
      ),
    discover: () => discover(events)
  };
};
