import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"
import { supabase,supabaseBUCKET } from "@/app/helper"


const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

        const formData = await request.formData()
        const newpassword = formData.get('password')


        const cekhp = await prisma.karyawanTb.findMany({
            where: {
                hp: String(formData.get('hp')),
                NOT: {
                    id: Number(params.id)
                }
            }
        })

        const cekemail = await prisma.karyawanTb.findMany({
            where: {
                email: String(formData.get('email')),
                NOT: {
                    id: Number(params.id)
                }
            }
        })

        if (cekemail.length > 0) {
            return NextResponse.json({ status: 555, pesan: "sudah ada email" })
        }

        if (cekhp.length > 0) {
            return NextResponse.json({ status: 556, pesan: "sudah ada hp" })
        }

        await prisma.karyawanTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                nama: String(formData.get('nama')),
                tempatLahir: String(formData.get('tempatlahir')),
                tanggalLahir: String(formData.get('tanggallahir')),
                alamat: String(formData.get('alamat')),
                hp: String(formData.get('hp')),
                email: String(formData.get('email')),
                UserTb: {
                    update: {
                        usernama: String(formData.get('email')),
                    }
                },
            }
        })

        if (newpassword !== '') {
            await prisma.karyawanTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    UserTb: {
                        update: {
                            password: await bcrypt.hash(String(formData.get('password')), 10),
                        }
                    },
                }
            })
        }

        if (formData.get('newfoto') === 'yes') {

            await prisma.karyawanTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    foto: String(formData.get('namaunik')),
                }
            })
        }

        if (formData.get('newktp') === 'yes') {

            await prisma.karyawanTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    ktp: String(formData.get('namaunikktp')),
                }
            })
        }

        if (formData.get('newcv') === 'yes') {

            await prisma.karyawanTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    CV: String(formData.get('namaunikcv')),
                }
            })
        }

        if (formData.get('newijazah') === 'yes') {

            await prisma.karyawanTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    ijazah: String(formData.get('namaunikijazah')),
                }
            })
        }

        return NextResponse.json({ status: 200, pesan: "berhasil" })

}

