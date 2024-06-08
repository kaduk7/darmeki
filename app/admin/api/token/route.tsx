import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { join } from "path"
import { promises as fsPromises } from "fs"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })

        return NextResponse.json(token, { status: 200 })

}
