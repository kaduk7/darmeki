import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async (request: Request, { params }: { params: { id: string } }) => {

        const requestjobdesk = await prisma.jobdeskTb.findUnique({
            where: {
                id: Number(params.id)
            },
            include: {
                KaryawanTb: true
            },
        });
        return NextResponse.json(requestjobdesk, { status: 200 })

}
