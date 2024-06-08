import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {
        const formData = await request.formData()
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
                status: String(formData.get('status')),
                suratTugas:String(formData.get('namaunikSurat')) ,
                beritaAcara:String(formData.get('namaunikBerita')) ,
                laporanAnggaran: String(formData.get('namaunikAnggaran')),
            },
        })
        return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {

        const jobdesk = await prisma.jobdeskTb.findMany({

            include: {
                KaryawanTb: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })

}
