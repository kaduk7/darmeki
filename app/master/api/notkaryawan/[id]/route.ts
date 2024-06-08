import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
        const karyawan = await prisma.karyawanTb.findMany({
            where: {
                NOT: {
                    id: Number(params.id)
                },
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(karyawan, { status: 200 })

}

