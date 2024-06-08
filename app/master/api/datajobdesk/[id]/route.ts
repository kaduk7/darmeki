import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { JobdeskTb } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
        const formData = await request.formData()
        const jobdesk = await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                namaJob: String(formData.get('namaJob')),
                keterangan: String(formData.get('keterangan')),
                deadline: String(formData.get('deadline')),
                status: String(formData.get('status')),
                karyawanId: Number(formData.get('karyawanId')),
            }
        })
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
                OR: [
                    {
                        status: 'Dalam Proses',
                    },
                    {
                        status: 'Proses',
                    },
                    {
                        status: 'Selesai',
                    },
                ],
                AND: {
                    karyawanId: Number(params.id),
                },
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
