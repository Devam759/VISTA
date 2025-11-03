// Dummy Wi-Fi check
// In real app: hit endpoint to verify SSID / captive portal
export async function verifyJKLUWifi() {
  await new Promise(r => setTimeout(r, 700))
  return {
    ok: true,
    ssid: 'JKLU',
  }
}
