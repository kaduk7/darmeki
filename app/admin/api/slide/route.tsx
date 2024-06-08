import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {
    const formData = await request.formData()
    await prisma.slideTb.create({
        data: {
            judul: String(formData.get('judul')),
            gambar:String(formData.get('namaunik')), 
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const user = await prisma.slideTb.findMany({
        orderBy: {
            judul: 'asc'
        }
    });
    return NextResponse.json(user, { status: 200 })
}