import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {

        const formData = await request.formData()

        await prisma.komentarTb.create({
            data: {
                beritaId: Number(formData.get('beritaId')),
                isi: String(formData.get('isi')),
                karyawanId: Number(formData.get('karyawanId')),
            },
        })
        return NextResponse.json({ pesan: 'berhasil' })

}



