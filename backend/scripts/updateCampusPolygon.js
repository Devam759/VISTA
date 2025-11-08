import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Actual JKLU campus boundary coordinates
const campusCoordinates = [
  { lat: 26.835786216245545, lng: 75.65131165087223, pointOrder: 1, label: 'PT_1' },
  { lat: 26.837407397333223, lng: 75.65114535391331, pointOrder: 2, label: 'PT_2' },
  { lat: 26.836622388388918, lng: 75.64845744520426, pointOrder: 3, label: 'PT_3' },
  { lat: 26.836051578163385, lng: 75.64818117767572, pointOrder: 4, label: 'PT_4' },
  { lat: 26.835461618240164, lng: 75.65019752830267, pointOrder: 5, label: 'PT_5' },
  { lat: 26.834609880617364, lng: 75.65087344497442, pointOrder: 6, label: 'PT_6' },
  { lat: 26.834014228898674, lng: 75.651178881526, pointOrder: 7, label: 'PT_7' },
  { lat: 26.83333241176029, lng: 75.65138272941113, pointOrder: 8, label: 'PT_8' },
  { lat: 26.832626058039946, lng: 75.65278552472591, pointOrder: 9, label: 'PT_9' },
  { lat: 26.833887678682544, lng: 75.65269734710455, pointOrder: 10, label: 'PT_10' },
  { lat: 26.834122828616806, lng: 75.6522286310792, pointOrder: 11, label: 'PT_11' },
  { lat: 26.83494166115547, lng: 75.6524958461523, pointOrder: 12, label: 'PT_12' }
];

async function updateCampusPolygon() {
  try {
    console.log('🗺️  Updating campus polygon with actual JKLU coordinates...\n');

    // Delete existing polygon points
    await prisma.campusPolygon.deleteMany({});
    console.log('✅ Cleared existing polygon points');

    // Insert new coordinates
    for (const coord of campusCoordinates) {
      await prisma.campusPolygon.create({
        data: {
          lat: coord.lat,
          lng: coord.lng,
          pointOrder: coord.pointOrder
        }
      });
      console.log(`✅ Added ${coord.label}: (${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)})`);
    }

    console.log('\n✅ Campus polygon updated successfully!');
    console.log(`📍 Total boundary points: ${campusCoordinates.length}`);
    
    // Calculate center point
    const avgLat = campusCoordinates.reduce((sum, c) => sum + c.lat, 0) / campusCoordinates.length;
    const avgLng = campusCoordinates.reduce((sum, c) => sum + c.lng, 0) / campusCoordinates.length;
    console.log(`📍 Campus center: ${avgLat.toFixed(6)}, ${avgLng.toFixed(6)}`);

  } catch (error) {
    console.error('❌ Error updating campus polygon:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCampusPolygon();
