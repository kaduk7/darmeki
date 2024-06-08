import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const berita = await prisma.beritaTb.findMany({
            where: {
                id: Number(params.id)
            },
            include: {
                KaryawanTb: true
            }
        });
        return NextResponse.json(berita, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}
