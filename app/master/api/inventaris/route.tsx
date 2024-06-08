import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {

    const formData = await request.formData()
    const xxx = await prisma.inventaris.findUnique({
        where: {
            kodeBarang: String(formData.get('kodeBarang'))
        },
    })
    if (xxx) {
        return NextResponse.json({ pesan: 'kode barang sudah ada' })
    }
    await prisma.inventaris.create({
        data: {
            kodeBarang: String(formData.get('kodeBarang')),
            nama: String(formData.get('nama')),
            merek: String(formData.get('merek')),
            stok: Number(formData.get('stok')),
        },
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const barang = await prisma.inventaris.findMany({
        orderBy: {
            id: "asc"
        }
    });
    return NextResponse.json(barang, { status: 200 })
}