import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

// export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {

//         const formData = await request.formData()
//         await prisma.peminjamanTb.update({
//             where: {
//                 id: Number(params.id)
//             },
//             data: {
//                 nama: String(formData.get('nama')),
//                 merek: String(formData.get('merek')),
//                 stok: Number(formData.get('stok')),
//             }
//         })
//         return NextResponse.json({ status: 200, pesan: "berhasil" })

// }


export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
        const barang = await prisma.peminjamanTb.delete({
            where: {
                id: Number(params.id)
            }
        })
        return NextResponse.json(barang, { status: 200 })

}