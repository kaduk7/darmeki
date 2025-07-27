import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const formData = await request.formData()
    await prisma.areakerjaTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            karyawanId: Number(formData.get('karyawanid')),
            ulId: Number(formData.get('ulid')),
        }
    })
    return NextResponse.json({ status: 200, pesan: "berhasil" })
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    await prisma.areakerjaTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json({ status: 200 })
}

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    const karyawan = await prisma.areakerjaTb.findMany({
        where: {
            ulId: Number(params.id)
        },
        include: {
            KaryawanTb: true,
            ULTb: true,
        },
        orderBy: {
            ULTb: {
                nama: "asc"
            }
        }
    });
    return NextResponse.json(karyawan, { status: 200 })

}