import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
        const formData = await request.formData()

        if (formData.get('konfirm') === 'terima') {
            await prisma.jobdeskTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    status: "Proses",
                    alasan: "",
                }
            })

            return NextResponse.json({ status: 200, pesan: "berhasil" })
        }
        else if (formData.get('konfirm') === 'tolak') {
            await prisma.jobdeskTb.update({
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


export const GET = async (request: Request, { params }: { params: { id: string } }) => {

        const requestjobdesk = await prisma.jobdeskTb.findMany({
            where: {
                OR: [
                    {
                        status: 'Verifikasi',
                    },
                    {
                        status: 'Tolak',
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
