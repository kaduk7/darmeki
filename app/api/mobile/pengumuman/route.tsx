import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async () => {
        const pengumuman = await prisma.pengumumanTb.findMany({
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json({ pesan: 'berhasil' ,data:pengumuman})
}

