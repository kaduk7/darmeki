import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
        const karyawan = await prisma.karyawanTb.findFirst({
            where: {
                id: Number(params.id)
            },
        });
        return NextResponse.json(karyawan?.foto,{ status:200})

}

