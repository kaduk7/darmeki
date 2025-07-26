import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {

    const formData = await request.formData()

    await prisma.unitTb.create({
        data: {
            nama: String(formData.get('nama')),
            usernama: String(formData.get('usernama')),
            petugas: String(formData.get('petugas')),
            UserTb: {
                create: {
                    usernama: String(formData.get('usernama')),
                    password: await bcrypt.hash(String(formData.get('password')), 10),
                    status: String(formData.get('petugas'))
                }
            },
           
        },
        include: {
            UserTb: true
        }
    })
   
    return NextResponse.json({ pesan: 'berhasil' })

}

export const GET = async () => {
    const karyawan = await prisma.karyawanTb.findMany({
        
        orderBy: {
            id: "asc"
        }
    });
    return NextResponse.json(karyawan, { status: 200 })

}