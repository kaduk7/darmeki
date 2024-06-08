import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { JobdeskTb } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

