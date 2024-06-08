import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {

        const formData = await request.formData()
        const team = formData.getAll('team').map(String);
        await prisma.requestJobdeskTb.create({
            data: {
                namaJob: String(formData.get('namaJob')),
                keterangan: String(formData.get('keterangan')),
                tanggalMulai:String(formData.get('tanggalMulai')),
                deadline: String(formData.get('deadline')),
                karyawanId: Number(formData.get('karyawanId')),
                status: 'Verifikasi',
                team: team.join(', '),
                namaTeam: String(formData.get('namaterpilih')),

            },
        })
        return NextResponse.json({ pesan: 'berhasil' })

}

export const GET = async (request: NextRequest) => {
 
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })
        const Id = Number(token!.karyawanId);

        const sekolah = await prisma.requestJobdeskTb.findMany({
            where: {
                karyawanId: Id,
            },
            include: {
                KaryawanTb: true,
            },
            orderBy: {
                id: "asc"
            }
        })
        return NextResponse.json(sekolah, { status: 201 })

}

