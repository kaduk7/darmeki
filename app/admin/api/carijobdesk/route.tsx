import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async () => {

        const jobdesk = await prisma.requestJobdeskTb.findMany({
            where: {
                OR: [
                    {
                        status: 'Tolak',
                    },
                    {
                        status: 'verifikasi',
                    },
                ],
            },
            include: {
                KaryawanTb: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })

}


