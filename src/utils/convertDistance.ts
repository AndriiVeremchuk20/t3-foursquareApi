const convertDistance = (distance: number) => {
  return distance > 1000
    ? `${(distance / 1000).toFixed(1)} km.`
    : `${distance.toFixed(0)} m.`;
};

export default convertDistance;
