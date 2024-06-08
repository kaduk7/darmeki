import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {

    await prisma.slideTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json({ status: 200 })
}