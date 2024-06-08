import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const POST = async (request: Request) => {
    const formData = await request.formData()

    const transaksi = await prisma.peminjamanTb.create({
        data: {
            karyawanId: Number(formData.get('karyawanId')),
            tanggal:String(formData.get('tanggal')),
            total: Number(formData.get('totalItem')),
            status: 'Pinjam',
        },
    })

    const lastId = await prisma.peminjamanTb.findFirst({
        orderBy: {
            id: 'desc',
        },
    });

    if (lastId) {
        const noId = lastId.id;
        const pilihbarang = JSON.parse(String(formData.get('selected'))) as any[];

        var x = [];
        for (let i = 0; i < pilihbarang.length; i++) {
            x.push({
                peminjamanId: noId,
                inventarisId: pilihbarang[i].id,
                qty: Number(pilihbarang[i].qty),
            });
        }

        await prisma.detailPinjamTb.createMany({
            data: x
        })

        for (let i = 0; i < pilihbarang.length; i++) {
            await prisma.inventaris.update({
                where: {
                    id: pilihbarang[i].id
                },
                data: {
                    stok: Number(pilihbarang[i].stokakhir),
                },
            })
        }
    }
    return NextResponse.json(transaksi, { status: 201 })
}

export const GET = async () => {
    const barang = await prisma.peminjamanTb.findMany({
        include:{
            KaryawanTb:true,
            detailPinjamTb:{
                include:{
                    inventaris:true
                }
            }
        },
        orderBy: {
            tanggal: "asc"
        }
    });
    return NextResponse.json(barang, { status: 200 })
}
