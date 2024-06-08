import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
    const jobdesk = await prisma.beritaTb.findFirst({
        orderBy: { id: 'desc' }
    });
    return NextResponse.json(jobdesk, { status: 200 })
}
