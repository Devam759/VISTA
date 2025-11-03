// Dummy geolocation check
// In real app: use browser geolocation + server-side geofence
export async function verifyInsideCampus() {
  // Simulate latency
  await new Promise(r => setTimeout(r, 800))
  // Always true for now
  return {
    ok: true,
    details: 'Within JKLU campus bounds',
  }
}
