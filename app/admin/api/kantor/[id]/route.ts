import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"
import { supabase,supabaseBUCKET } from "@/app/helper"


const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

        const formData = await request.formData()

        await prisma.profilTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                nama: String(formData.get('nama')),
                alamat: String(formData.get('alamat')),
                email: String(formData.get('email')),
                telp: String(formData.get('telp')),
                wa: String(formData.get('wa')),
                lokasi: String(formData.get('lokasi')),
                radius: Number(formData.get('radius')),
            }
        })

      

        return NextResponse.json({ status: 200, pesan: "berhasil" })

}

