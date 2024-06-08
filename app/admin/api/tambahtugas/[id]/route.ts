import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const formData = await request.formData()
    const team = formData.getAll('team').map(String);
    const newsurat = formData.get('newsurat')
    const newberita = formData.get('newberita')
    const newanggaran = formData.get('newanggaran')

    await prisma.jobdeskTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            namaJob: String(formData.get('namaJob')),
            keterangan: String(formData.get('keterangan')),
            tanggalMulai: String(formData.get('tanggalMulai')),
            deadline: String(formData.get('deadline')),
            karyawanId: Number(formData.get('karyawanId')),
            team: team.join(', '),
            namaTeam: String(formData.get('namaterpilih')),
            status: String(formData.get('status')),
        }
    })

    if (newsurat === 'yes') {
        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                suratTugas: String(formData.get('namaunikSurat')),
            }
        })
    }

    if (newberita === 'yes') {

        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                beritaAcara: String(formData.get('namaunikBerita')),
            }
        })
    }

    if (newanggaran === 'yes') {

        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                laporanAnggaran: String(formData.get('namaunikAnggaran')),
            }
        })
    }
    return NextResponse.json({ status: 200, pesan: "berhasil" })
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    const jobdesk = await prisma.jobdeskTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(jobdesk, { status: 200 })
}

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    const requestjobdesk = await prisma.jobdeskTb.findMany({
        where: {
            karyawanId: Number(params.id)
        },
        include: {
            KaryawanTb: true
        }
    });
    return NextResponse.json(requestjobdesk, { status: 200 })
}
