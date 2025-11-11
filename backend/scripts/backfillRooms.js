import prisma from '../config/prisma.js'

async function main() {
  console.log('Starting room backfill...')

  const students = await prisma.student.findMany({
    select: { id: true, hostelId: true, roomNo: true }
  })

  let createdRooms = 0
  let linkedStudents = 0

  // Create rooms per (hostelId, roomNo)
  const seen = new Set()
  for (const s of students) {
    if (!s.roomNo || !s.hostelId) continue
    const key = `${s.hostelId}::${s.roomNo}`
    if (seen.has(key)) continue
    seen.add(key)

    await prisma.room.upsert({
      where: {
        hostelId_roomNo: {
          hostelId: s.hostelId,
          roomNo: s.roomNo
        }
      },
      update: {},
      create: {
        hostelId: s.hostelId,
        roomNo: s.roomNo,
        isAC: false
      }
    })
    createdRooms++
  }

  // Link students to rooms
  for (const s of students) {
    if (!s.roomNo || !s.hostelId) continue
    const room = await prisma.room.findUnique({
      where: { hostelId_roomNo: { hostelId: s.hostelId, roomNo: s.roomNo } },
      select: { id: true }
    })
    if (room) {
      await prisma.student.update({
        where: { id: s.id },
        data: { roomId: room.id }
      })
      linkedStudents++
    }
  }

  console.log(`Backfill complete. Rooms upserted: ${createdRooms}, Students linked: ${linkedStudents}`)
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(async () => { await prisma.$disconnect() })
