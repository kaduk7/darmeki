import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {

        const formData = await request.formData()

        const cekemail = await prisma.karyawanTb.findUnique({
            where: {
                email: String(formData.get('email'))
            },
        })

        const cekhp = await prisma.karyawanTb.findUnique({
            where: {
                hp: String(formData.get('hp'))
            },
        })

        if (cekemail) {
            return NextResponse.json({ pesan: "Email sudah ada" })
        }
        if (cekhp) {
            return NextResponse.json({ pesan: "No Hp sudah ada" })
        }
        await prisma.karyawanTb.create({
            data: {
                nama: String(formData.get('nama')),
                tempatLahir: String(formData.get('tempatlahir')),
                tanggalLahir: String(formData.get('tanggallahir')),
                alamat: String(formData.get('alamat')),
                hp: String(formData.get('hp')),
                email: String(formData.get('email')),
                divisi: String(formData.get('divisi')),
                UserTb: {
                    create: {
                        usernama: String(formData.get('email')),
                        password: await bcrypt.hash(String(formData.get('password')), 10),
                        status: String(formData.get('divisi'))
                    }
                },
                HakAksesTb: {
                    create: {
                        datakaryawan: String(formData.get('karyawanCekValue')),
                        informasi: String(formData.get('informasiCekValue')),
                        jobdesk: String(formData.get('jobdeskCekValue')),
                    }
                }
            },
            include: {
                UserTb: true
            }
        })
        return NextResponse.json({ pesan: 'berhasil' })
}

export const GET = async () => {
        const karyawan = await prisma.karyawanTb.findMany({
            include: {
                HakAksesTb: true,
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(karyawan, { status: 200 })
}