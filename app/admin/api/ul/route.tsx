import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    const formData = await request.formData()
    await prisma.uLTb.create({
        data: {
            nama: String(formData.get('nama')),
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
    const user = await prisma.uLTb.findMany({
        where: {
            NOT: {
                nama: {
                    equals: 'adminxxxxxxxxxxxxxxx',
                    mode: 'insensitive'
                }
            }
        },
        orderBy: {
            nama: 'asc'
        }
    });
    return NextResponse.json(user, { status: 200 })
}