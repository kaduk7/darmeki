import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic';

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

    const formData = await request.formData()
    const cekhp = await prisma.karyawanTb.findMany({
        where: {
            hp: String(formData.get('hp')),
            NOT: {
                id: Number(params.id)
            }
        }
    })

    const cekemail = await prisma.karyawanTb.findMany({
        where: {
            email: String(formData.get('email')),
            NOT: {
                id: Number(params.id)
            }
        }
    })

    if (cekemail.length > 0) {
        return NextResponse.json({ status: 555, pesan: "sudah ada email" })
    }

    if (cekhp.length > 0) {
        return NextResponse.json({ status: 556, pesan: "sudah ada hp" })
    }

    await prisma.karyawanTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            nama: String(formData.get('nama')),
            tempatLahir: String(formData.get('tempatlahir')),
            tanggalLahir: String(formData.get('tanggallahir')),
            alamat: String(formData.get('alamat')),
            hp: String(formData.get('hp')),
            email: String(formData.get('email')),
            NIP: String(formData.get('NIP')),
            jekel: String(formData.get('jekel')),
        }
    })

    return NextResponse.json({ status: 200, pesan: "berhasil" })

}


// export const GET = async (request: Request, { params }: { params: { id: string } }) => {
//         const karyawan = await prisma.karyawanTb.findMany({
//             where: {
//                 divisiId: Number(params.id)
//             },
//             orderBy: {
//                 id: "asc"
//             }
//         });
//         return NextResponse.json(karyawan, { status: 200 })

// }

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    const karyawan = await prisma.karyawanTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(karyawan, { status: 200 })

}