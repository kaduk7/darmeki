import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()
    await prisma.areakerjaTb.create({
        data: {
            karyawanId: Number(formData.get('karyawanid')),
            ulId: Number(formData.get('ulid')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const user = await prisma.areakerjaTb.findMany({
        include:{
            KaryawanTb:true,
            ULTb:true,
        },
    });
    return NextResponse.json(user, { status: 200 })
}