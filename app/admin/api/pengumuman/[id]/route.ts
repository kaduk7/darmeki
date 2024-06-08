import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
        const formData = await request.formData()
        const divisi = formData.getAll('divisi').map(String);
        await prisma.pengumumanTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                judul: String(formData.get('judul')),
                tanggalPengumuman: String(formData.get('tanggalPengumuman')),
                isi: String(formData.get('isi')),
                divisi: divisi.join(', '),
            }
        })

        return NextResponse.json({ status: 200, pesan: "berhasil" })

}


export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
        const pengumuman = await prisma.pengumumanTb.delete({
            where: {
                id: Number(params.id)
            }
        })
        return NextResponse.json(pengumuman, { status: 200 })

}
