import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {

    const formData = await request.formData()

    await prisma.karyawanTb.create({
        data: {
            nama: String(formData.get('nama')),
            hp: String(formData.get('hp')),
            email: String(formData.get('email')),
            divisi: String(formData.get('divisi')),
            UserTb: {
                create: {
                    usernama: String(formData.get('email')),
                    password: await bcrypt.hash(String(formData.get('password')), 10),
                    status: String(formData.get('divisi'))
                }
            },
            HakAksesTb: {
                create: {
                    datakaryawan: String(formData.get('karyawanCekValue')),
                    informasi: String(formData.get('informasiCekValue')),
                    jobdesk: String(formData.get('jobdeskCekValue')),
                }
            },
        },
        include: {
            UserTb: true
        }
    })
    await prisma.profilTb.create({
        data:{
            
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })

}

export const GET = async () => {
    const karyawan = await prisma.karyawanTb.findMany({
        include: {
            HakAksesTb: true,
        },
        orderBy: {
            id: "asc"
        }
    });
    return NextResponse.json(karyawan, { status: 200 })

}