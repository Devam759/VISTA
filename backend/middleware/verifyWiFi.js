export const verifyCampusWiFi = (req, res, next) => {
  // Wi‑Fi verification disabled: always allow
  req.wifiVerified = true;
  return next();
};
