import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
        const pengumuman = await prisma.pengumumanTb.findUnique({
            where: {
                id: Number(params.id)
            },
        });
        return NextResponse.json({ pesan: 'berhasil' ,data:pengumuman})

}

