import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

    const formData = await request.formData()
    const team = formData.getAll('team').map(String);
    const xxx = await prisma.requestJobdeskTb.findMany({
        where: {
            AND: [
                {
                    id: Number(params.id),
                },
                {
                    status: "Dalam Proses"
                },
            ],
        }
    })
    if (xxx.length > 0) {
        return NextResponse.json({ status: 556, pesan: "tidak bisa diedit" })
    }

    await prisma.requestJobdeskTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            namaJob: String(formData.get('namaJob')),
            keterangan: String(formData.get('keterangan')),
            deadline: String(formData.get('deadline')),
            tanggalMulai: String(formData.get('tanggalMulai')),
            team: team.join(', '),
            namaTeam: String(formData.get('namaterpilih')),
        }
    })
    return NextResponse.json({ status: 200, pesan: "berhasil" })

}


export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    const xxx = await prisma.requestJobdeskTb.findMany({
        where: {
            AND: [
                {
                    id: Number(params.id),
                },
                {
                    status: "Dalam Proses"
                },
            ],


        }
    })
    if (xxx.length > 0) {
        return NextResponse.json({ status: 556, pesan: "tidak bisa dihapus" })
    }

    await prisma.requestJobdeskTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json({ status: 200, pesan: "berhasil" })

}

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    const requestjobdesk = await prisma.requestJobdeskTb.findMany({
        where: {
            karyawanId: Number(params.id)
        },
        include: {
            KaryawanTb: true
        },
        orderBy: {
            id: "asc"
        }
    });
    return NextResponse.json(requestjobdesk, { status: 200 })

}
