import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: NextRequest) => {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    const karyawanId = Number(token!.karyawanId);

    const profil = await prisma.karyawanTb.findUnique({
      where: {
        id: karyawanId,
      },
      include: {
        HakAksesTb: true,
        UserTb: true
      },
    })
    return NextResponse.json(profil, { status: 201 })
}