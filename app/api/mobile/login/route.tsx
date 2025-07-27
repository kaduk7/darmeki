import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {
    const body = await request.json();
    const users = await prisma.userTb.findMany({
        where: {
            usernama:
            {
                contains: String(body.usernama),
                mode: 'insensitive'
            },
        },
        include: {
            KaryawanTb: true,
        }
    });

    if (users.length == 0) {
        return NextResponse.json({ pesan: 'Usernama tidak ditemukan', error: true })
    }

    const isValid = await bcrypt.compare(
        String(body.password),
        String(users[0].password)
    );

    if (!isValid) {
        return NextResponse.json({ pesan: 'Password Salah', error: true })
    }
    return NextResponse.json({ error: false, pesan: "Login berhasil", data: users[0] });
}


