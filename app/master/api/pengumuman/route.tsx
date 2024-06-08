import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: NextRequest) => {

        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })
        const DivisiId = String(token!.divisi);

        const jobdesk = await prisma.pengumumanTb.findMany({
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })

}

