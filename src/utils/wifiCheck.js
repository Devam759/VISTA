// College WiFi SSIDs
const ALLOWED_SSIDS = ['JKLU', 'JKLU-Campus', 'JKLU-Student', 'JKLU-Staff']

export async function verifyJKLUWifi() {
  // Wi‑Fi verification disabled: always allow
  return {
    ok: true,
    ssid: null,
    details: 'Wi‑Fi check disabled'
  }
}
