import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {
    const body = await request.json();
    const pengumuman = await prisma.absensiTb.create({
        data: {
            karyawanId: Number(body.karyawanId),
            keterangan: body.keterangan,
        },
    })

    return NextResponse.json( {pesan: 'berhasil',status:200})

}

export const GET = async () => {
    const pengumuman = await prisma.karyawanTb.findMany({
        orderBy: {
            id: "asc"
        },
        include:{
            AbsensiTb:true
        }
    });
    return NextResponse.json({ pesan: 'berhasil', data: pengumuman })
}

