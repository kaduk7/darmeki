import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()


export const GET = async (request: NextRequest) => {

        const berita = await prisma.beritaTb.findMany({

            include: {
                KaryawanTb: true
            },
            take: 3,
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(berita, { status: 200 })

}

