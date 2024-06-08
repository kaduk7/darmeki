import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { supabase,supabaseBUCKET } from "@/app/helper"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'; 

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    const formData = await request.formData()
    const ket = formData.get('keteranganAkhir')

    // const file = formData.get('file') as File;
    // const namaunik = Date.now() + '-' + file.name
    // await supabase.storage
    //     .from(supabaseBUCKET)
    //     .upload(`file/${namaunik}`, file);

    // const fileSuratTugas = formData.get('fileSurat') as File;
    // const namaunikSurat = Date.now() + '-' + fileSuratTugas.name
    // await supabase.storage
    //     .from(supabaseBUCKET)
    //     .upload(`file/${namaunikSurat}`, fileSuratTugas);


    // const fileBeritaAcara = formData.get('fileBerita') as File;
    // const namaunikBerita = Date.now() + '-' + fileBeritaAcara.name
    // await supabase.storage
    //     .from(supabaseBUCKET)
    //     .upload(`file/${namaunikBerita}`, fileBeritaAcara);

    // const fileAnggaran = formData.get('fileAnggaran') as File;
    // const namaunikAnggaran = Date.now() + '-' + fileAnggaran.name
    // await supabase.storage
    //     .from(supabaseBUCKET)
    //     .upload(`file/${namaunikAnggaran}`, fileAnggaran);

    await prisma.jobdeskTb.update({
        where: {
            id: Number(params.id)
        },
        data: {
            tanggalPelaksanaan: String(formData.get('tanggalkerja')),
            file: String(formData.get('namaunik')),
            suratTugas: String(formData.get('namaunikSurat')),
            beritaAcara: String(formData.get('namaunikBerita')),
            laporanAnggaran: String(formData.get('namaunikAnggaran')),
            status: "Selesai"
        }
    })

    if (ket === '') {
        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                keteranganAkhir: "Tidak Ada"
            }
        })
    }
    else {
        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                keteranganAkhir: String(formData.get('keteranganAkhir'))
            }
        })
    }
    return NextResponse.json({ status: 200, pesan: "berhasil" })
}
