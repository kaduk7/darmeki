import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: NextRequest) => {

    const tugas = await prisma.jobdeskTb.findMany({
      // where: {
      //   OR: [
      //     {
      //       status: 'Dalam Proses',
      //     },
      //     {
      //       status: 'Proses',
      //     },
      //     {
      //       status: 'Selesai',
      //     },
      //   ],
        

      // },
      include: {
        KaryawanTb: true,
      },
      orderBy: {
        id: "asc"
      }
    })
    return NextResponse.json(tugas, { status: 200 })

}