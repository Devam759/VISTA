import prisma from '../config/prisma.js'

async function main() {
  const targetName = 'anirudh chaudhary'

  const student = await prisma.student.findFirst({
    where: {
      name: {
        contains: targetName,
        mode: 'insensitive'
      }
    },
    select: { id: true, name: true, rollNo: true }
  })

  if (!student) {
    console.error(`Student not found for name containing: ${targetName}`)
    return
  }

  console.log(`➡ Adding sample attendance for ${student.rollNo} - ${student.name}`)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build last 5 days including today
  const days = [0, 1, 2, 3, 4].map((offset) => {
    const d = new Date(today)
    d.setDate(d.getDate() - offset)
    d.setHours(0, 0, 0, 0)
    return d
  })

  // Sample statuses from most recent to older
  // Ensure these match your Prisma enum: Marked | Late | Missed
  const statuses = ['Marked', 'Marked', 'Late', 'Missed', 'Marked']

  for (let i = 0; i < days.length; i++) {
    const date = days[i]
    const status = statuses[i] || 'Marked'

    // Use 22:05 for Marked, 22:40 for Late, 23:10 for Missed (fallback 22:10)
    const time = new Date(date)
    if (status === 'Marked') time.setHours(22, 5, 0, 0)
    else if (status === 'Late') time.setHours(22, 40, 0, 0)
    else if (status === 'Missed') time.setHours(23, 10, 0, 0)
    else time.setHours(22, 10, 0, 0)

    await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: student.id,
          date
        }
      },
      update: {
        status,
        time
      },
      create: {
        studentId: student.id,
        date,
        time,
        status,
        faceVerified: status !== 'Missed'
      }
    })

    console.log(`✓ Upserted ${status} for ${date.toISOString().split('T')[0]}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
