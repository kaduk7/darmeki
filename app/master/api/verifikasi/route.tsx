import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 


export const GET = async (request: NextRequest) => {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    const Id = Number(token!.karyawanId);

    const xxx = await prisma.jobdeskTb.findMany({
      where: {
        OR: [
          {
            status: 'Verifikasi',
          },
          {
            status: 'Tolak',
          },
        ],
        AND: {
          karyawanId: Id,
        },
      },
      include: {
        KaryawanTb: true,
      },
      orderBy: {
        id: "asc"
      }
    })
    return NextResponse.json(xxx, { status: 201 })

}


