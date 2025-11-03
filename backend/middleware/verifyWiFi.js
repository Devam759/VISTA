export const verifyCampusWiFi = (req, res, next) => {
  // Option 1: Check IP prefix (e.g., campus IPs start with 10.x.x.x or specific range)
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Option 2: Check custom header sent by frontend (SSID)
  const ssid = req.headers['x-wifi-ssid'];

  // For development: allow localhost
  if (clientIP.includes('127.0.0.1') || clientIP.includes('::1') || clientIP.includes('localhost')) {
    req.wifiVerified = true;
    return next();
  }

  // Check if SSID matches campus Wi-Fi
  const allowedSSIDs = ['JKLU', 'JKLU-Campus', 'JKLU-Student'];
  if (ssid && allowedSSIDs.includes(ssid)) {
    req.wifiVerified = true;
    return next();
  }

  // Check IP range (example: 10.0.0.0/8 or 192.168.x.x)
  // Customize this based on your campus network
  if (clientIP.startsWith('10.') || clientIP.startsWith('192.168.')) {
    req.wifiVerified = true;
    return next();
  }

  return res.status(403).json({ error: 'Campus Wi-Fi verification failed' });
};
