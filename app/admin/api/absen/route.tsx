import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {
    const formData = await request.formData()
    const divisi = formData.getAll('divisi').map(String);
    const pengumuman = await prisma.pengumumanTb.create({
        data: {
            judul: String(formData.get('judul')),
            tanggalPengumuman: String(formData.get('tanggalPengumuman')),
            isi: String(formData.get('isi')),
            divisi: divisi.join(', '),
        },
    })

    return NextResponse.json([pengumuman], { status: 201 })

}

// export const GET = async () => {
//     const absen = await prisma.absensiTb.findMany({
        
//         include: {
//             KaryawanTb: true
//         },
//         // orderBy: {
//         //     KaryawanTb:{
//         //         nama:'asc'
//         //     },
//         // },
//     });
//     return NextResponse.json(absen, { status: 200 })
// }

export const GET = async () => {
    const absen = await prisma.karyawanTb.findMany({
        
        include: {
            AbsensiTb: true
        },
    });
    return NextResponse.json(absen, { status: 200 })
}