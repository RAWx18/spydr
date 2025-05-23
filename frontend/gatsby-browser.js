module.exports.onRouteUpdate = ({ location, prevLocation }) => {
  const event = new CustomEvent(
    'route-change',
    { detail: { location, prevLocation } }
  );
  window.dispatchEvent(event);
};
