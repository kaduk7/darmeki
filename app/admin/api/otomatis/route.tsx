import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async () => {
    try {
        const lastId = await prisma.pengumumanTb.findFirst({
            orderBy: {
                id: 'desc',
            },
        });
        let nomorUrut = 1;

        if (lastId) {
            const lastNomorFaktur = lastId.id;
            nomorUrut = lastNomorFaktur + 1;
        }

        return NextResponse.json(nomorUrut, { status: 201 })
    } finally {
        await prisma.$disconnect();
    }
}
