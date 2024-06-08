import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })
    const Id = Number(token!.karyawanId);
    const karyawan = await prisma.karyawanTb.findUnique({
        where: {
            id: Id
        },
    })

    return NextResponse.json(karyawan, { status: 200 })

}
