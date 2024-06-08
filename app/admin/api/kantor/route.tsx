import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const GET = async (request: NextRequest) => {
  
    const kantor = await prisma.profilTb.findFirst()
    return NextResponse.json(kantor, { status: 201 })
}