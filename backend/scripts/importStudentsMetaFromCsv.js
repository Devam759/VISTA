import fs from 'fs'
import path from 'path'
import prisma from '../config/prisma.js'

// Simple CSV parser that supports quoted fields with commas
function parseCsv(content) {
  const rows = []
  let i = 0, field = '', row = [], inQuotes = false
  while (i < content.length) {
    const ch = content[i]
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') { // escaped quote
          field += '"'
          i += 2
          continue
        } else {
          inQuotes = false
          i++
          continue
        }
      } else {
        field += ch
        i++
        continue
      }
    } else {
      if (ch === '"') { inQuotes = true; i++; continue }
      if (ch === ',') { row.push(field); field = ''; i++; continue }
      if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue }
      if (ch === '\r') { i++; continue }
      field += ch
      i++
    }
  }
  // flush last field
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

function normalizeHostelName(s) {
  if (!s) return ''
  return String(s).trim().toUpperCase()
}

function normalizeRoomNo(s) {
  return String(s || '').trim().toUpperCase()
}

function truthyAc(value) {
  const v = String(value || '').trim().toUpperCase()
  return v === 'AC' || v === 'A/C' || v === 'YES'
}

async function main() {
  // Adjust CSV path if needed
  const csvPath = path.resolve(process.cwd(), 'public', 'FINAL SHEET OF BH-2.csv')
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found at', csvPath)
    process.exit(1)
  }
  const content = fs.readFileSync(csvPath, 'utf8')
  const rows = parseCsv(content)
  if (!rows.length) {
    console.error('CSV seems empty')
    process.exit(1)
  }
  // Find header row by looking for column names
  const headerIdx = rows.findIndex(r => r.some(c => /Room\s*NO\.?/i.test(c)))
  if (headerIdx < 0) {
    console.error('Header row not found. Ensure CSV has Room NO. column header')
    process.exit(1)
  }
  const header = rows[headerIdx]
  const dataRows = rows.slice(headerIdx + 1)

  const col = (nameRegex) => header.findIndex(h => new RegExp(nameRegex, 'i').test(h || ''))
  const idxHostel = col('^Hostel$')
  const idxRoom = col('Room\s*NO\.?')
  const idxAc = col('^AC\/?NAC$|AC\s*\/\s*NAC|AC\\/NAC')
  const idxName = col("Student's\s*Name|Student Name")
  const idxReg = col('Student\s*Reg\.\s*no|Student\s*Reg')
  const idxRoll = col('Student\s*Roll\s*No\.|Roll\s*No')

  if (idxHostel < 0 || idxRoom < 0) {
    console.error('Required columns missing. Needed: Hostel, Room NO.')
    process.exit(1)
  }

  let updatedRooms = 0
  let updatedStudents = 0

  // Build a cache of hostel name -> id
  const hostels = await prisma.hostel.findMany({ select: { id: true, name: true } })
  const hostelByName = new Map(hostels.map(h => [normalizeHostelName(h.name), h]))

  for (const r of dataRows) {
    const hostelRaw = r[idxHostel]
    const roomRaw = r[idxRoom]
    if (!hostelRaw || !roomRaw) continue

    const hostelName = normalizeHostelName(hostelRaw)
    const roomNo = normalizeRoomNo(roomRaw)

    const hostel = hostelByName.get(hostelName)
    if (!hostel) {
      // Skip rows for hostels not present in DB
      continue
    }

    // Update Room.isAC
    if (idxAc >= 0) {
      const isAC = truthyAc(r[idxAc])
      await prisma.room.upsert({
        where: { hostelId_roomNo: { hostelId: hostel.id, roomNo } },
        update: { isAC },
        create: { hostelId: hostel.id, roomNo, isAC }
      })
      updatedRooms++
    }

    // Update Student.regNo if present
    const studentName = idxName >= 0 ? String(r[idxName] || '').trim() : ''
    const regNo = idxReg >= 0 ? String(r[idxReg] || '').trim() : ''
    const rollNo = idxRoll >= 0 ? String(r[idxRoll] || '').trim() : ''

    if (regNo || studentName || rollNo) {
      // Prefer rollNo match if available, else match by (name + roomNo + hostelId)
      let studentsToUpdate = []
      if (rollNo) {
        const s = await prisma.student.findFirst({ where: { rollNo } })
        if (s) studentsToUpdate = [s]
      } else if (studentName) {
        studentsToUpdate = await prisma.student.findMany({
          where: {
            hostelId: hostel.id,
            roomNo,
            name: { equals: studentName }
          },
          select: { id: true }
        })
      }

      if (studentsToUpdate.length) {
        for (const s of studentsToUpdate) {
          await prisma.student.update({ where: { id: s.id }, data: { regNo } })
          updatedStudents++
        }
      }
    }
  }

  console.log(`Import complete. Rooms updated: ${updatedRooms}, Students updated: ${updatedStudents}`)
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(async () => { await prisma.$disconnect() })
