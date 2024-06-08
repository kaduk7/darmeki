import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: NextRequest) => {

        const jobdesk = await prisma.beritaTb.findMany({

            include: {
                KaryawanTb: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })

}
