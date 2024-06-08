import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {

    const formData = await request.formData();

    await prisma.beritaTb.create({
        data: {
            judul: String(formData.get('judul')),
            tanggalBerita: String(formData.get('tanggalBerita')),
            isi: String(formData.get('isi')),
            karyawanId: Number(formData.get('karyawanId')),
            foto: String(formData.get('namaunik')),
        },
    });

    return NextResponse.json({ pesan: 'berhasil' })
};


export const GET = async (request: NextRequest) => {

    const berita = await prisma.beritaTb.findMany({

        include: {
            KaryawanTb: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return NextResponse.json(berita, { status: 200 })

}
