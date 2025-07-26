import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

        const formData = await request.formData()
        const newpass = formData.get('newpass')


        const cekusernama= await prisma.unitTb.findMany({
            where: {
                usernama: String(formData.get('usernama')),
                NOT: {
                    id: Number(params.id)
                }
            }
        })

        if (cekusernama.length > 0) {
            return NextResponse.json({ status: 555, pesan: "sudah ada usernama" })
        }


        await prisma.unitTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                nama: String(formData.get('nama')),
                usernama: String(formData.get('usernama')),
                petugas: String(formData.get('petugas')),
                UserTb: {
                    update: {
                        usernama: String(formData.get('usernama')),
                        status: String(formData.get('petugas'))
                    }
                },
               
            }
        })

        if (newpass === 'yes') {
            await prisma.unitTb.update({
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

        return NextResponse.json({ status: 200, pesan: "berhasil" })

}


// export const GET = async (request: Request, { params }: { params: { id: string } }) => {
//         const karyawan = await prisma.karyawanTb.findMany({
//             where: {
//                 divisiId: Number(params.id)
//             },
//             orderBy: {
//                 id: "asc"
//             }
//         });
//         return NextResponse.json(karyawan, { status: 200 })

// }

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
        const karyawan = await prisma.unitTb.delete({
            where: {
                id: Number(params.id)
            }
        })
        return NextResponse.json(karyawan, { status: 200 })

}