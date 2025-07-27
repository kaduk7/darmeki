import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic';

export const POST = async (request: Request) => {

    const formData = await request.formData()

    await prisma.uLTb.create({
        data: {
            nama: 'adminxxxxxxxxxxxxxxx',
        }
    })
    
   const lastId = await prisma.uLTb.findFirst({
        orderBy: {
            id: 'desc',
        },
    });

    await prisma.unitTb.create({
        data: {
            nama: String(formData.get('nama')),
            ULId: Number(lastId?.id),
            usernama: String(formData.get('usernama')),
            petugas: 'Admin',
            UserTb: {
                create: {
                    usernama: String(formData.get('usernama')),
                    password: await bcrypt.hash(String(formData.get('password')), 10),
                    status: 'Admin',
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
    const unit = await prisma.unitTb.findMany({

        orderBy: {
            id: "asc"
        }
    });
    return NextResponse.json(unit, { status: 200 })

}