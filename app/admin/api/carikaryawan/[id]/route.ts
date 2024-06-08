import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()



export const GET = async (request: Request, { params }: { params: { id: string } }) => {

        const karyawan = await prisma.karyawanTb.findUnique({
            where: {
                id: Number(params.id)
            }
        });
        return NextResponse.json(karyawan, { status: 200 })

}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {

    const karyawan = await prisma.karyawanTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(karyawan, { status: 200 })

}