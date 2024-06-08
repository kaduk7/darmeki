import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const formData = await request.formData()

    if (formData.get('konfirm') === 'terima') {
        const jobdesk = await prisma.requestJobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                status: "Dalam Proses",
                alasan: "",
            }
        })
        const team = formData.getAll('team').map(String);

        await prisma.jobdeskTb.create({
            data: {
                namaJob: String(formData.get('namaJob')),
                keterangan: String(formData.get('keterangan')),
                tanggalMulai: String(formData.get('tanggalMulai')),
                deadline: String(formData.get('deadline')),
                karyawanId: Number(formData.get('karyawanId')),
                team: team.join(', '),
                namaTeam: String(formData.get('namaterpilih')),
                status: "Dalam Proses",
                suratTugas: String(formData.get('namaunikSurat')),
                beritaAcara: String(formData.get('namaunikBerita')),
                laporanAnggaran: String(formData.get('namaunikAnggaran')),

            },
        })
        return NextResponse.json({ status: 200, pesan: "berhasil" })
    }
    else if (formData.get('konfirm') === 'tolak') {
        const jobdesk = await prisma.requestJobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                status: "Tolak",
                alasan: String(formData.get('alasan')),
            }
        })
        return NextResponse.json({ status: 200, pesan: "berhasil" })
    }
}


// export const GET = async (request: Request, { params }: { params: { id: string } }) => {
//     const requestjobdesk = await prisma.jobdeskTb.findMany({
//         where: {
//             OR: [
//                 {
//                     status: 'Verifikasi',
//                 },
//                 {
//                     status: 'Tolak',
//                 },
//             ],
//             AND: {
//                 karyawanId: Number(params.id),
//             },
//         },
//         include: {
//             KaryawanTb: true
//         },
//         orderBy: {
//             id: "asc"
//         }
//     });
//     return NextResponse.json(requestjobdesk, { status: 200 })

// }

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    const requestjobdesk = await prisma.requestJobdeskTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(requestjobdesk, { status: 200 })
}