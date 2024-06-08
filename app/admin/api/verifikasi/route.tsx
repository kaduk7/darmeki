import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async () => {
        const xxxjobdesk = await prisma.requestJobdeskTb.findMany({
            where: {
                OR: [
                    {
                        status: 'Tolak',
                    },
                    {
                        status: 'Verifikasi',
                    },
                ],
            },
            include: {
                KaryawanTb: true,
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(xxxjobdesk, { status: 200 })
}


