/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { JobdeskTb, KaryawanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import Select from 'react-select';
import { supabase, supabaseBUCKET, supabaseUrl, StyleSelect } from "@/app/helper"

function Update({ jobdesk, karyawan, reload, karyawanTb }: { jobdesk: JobdeskTb, karyawan: Array<any>, reload: Function, karyawanTb: KaryawanTb }) {

    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [tanggalMulai, setTanggalMulai] = useState(moment(jobdesk.tanggalMulai).format("YYYY-MM-DD"))
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("YYYY-MM-DD"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [status, setStatus] = useState(jobdesk.status)
    const [divisi, setDivisi] = useState(karyawanTb.divisi)
    const [karyawanId, setKaryawanId] = useState(String(jobdesk.karyawanId))
    const [selectkaryawan, setSelectkaryawan] = useState([])
    const [fileSuratTugas, setFileSurattugas] = useState<File | null>()
    const [fileBeritaAcara, setFileBeritaacara] = useState<File | null>()
    const [fileAnggaran, setFileAnggaran] = useState<File | null>()

    const [previewSurat, setPreviewSurat] = useState(jobdesk.suratTugas)
    const [cekpreviewSurat, setCekPreviewSurat] = useState(jobdesk.suratTugas)
    const [previewBerita, setPreviewBerita] = useState(jobdesk.beritaAcara)
    const [cekpreviewBerita, setCekPreviewBerita] = useState(jobdesk.beritaAcara)
    const [previewAnggaran, setPreviewAnggaran] = useState(jobdesk.laporanAnggaran)
    const [cekpreviewAnggaran, setCekPreviewAnggaran] = useState(jobdesk.laporanAnggaran)
    const [show, setShow] = useState(false);

    const [team, setTeam] = useState<string[]>(["1"]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [namaterpilih, setNamaterpilih] = useState('');

    const [dataKaryawan, setDataKaryawan] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    if (isLoading) {
        Swal.fire({
            title: "Mohon tunggu!",
            html: "Sedang mengirim data ke server",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })
    }

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => {
        setShow(true);
        setPreviewSurat(jobdesk.suratTugas)
        setCekPreviewSurat(jobdesk.suratTugas)
        setPreviewBerita(jobdesk.beritaAcara)
        setCekPreviewBerita(jobdesk.beritaAcara)
        setPreviewAnggaran(jobdesk.laporanAnggaran)
        setCekPreviewAnggaran(jobdesk.laporanAnggaran)
    }

    useEffect(() => {
        DivisiAwal()
        KaryawanAwal()
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setTeam(valuesArray)
        setNamaterpilih(namaTeam)
    }, [])

    

    useEffect(() => {
        if (!fileSuratTugas) {
            setPreviewSurat(jobdesk.suratTugas)
            return
        }
        const objectUrlSurat = URL.createObjectURL(fileSuratTugas)
        setPreviewSurat(objectUrlSurat)

        return () => URL.revokeObjectURL(objectUrlSurat)
    }, [fileSuratTugas])

    useEffect(() => {
        if (!fileBeritaAcara) {
            setPreviewBerita(jobdesk.beritaAcara)
            return
        }
        const objectUrlBerita = URL.createObjectURL(fileBeritaAcara)
        setPreviewBerita(objectUrlBerita)

        return () => URL.revokeObjectURL(objectUrlBerita)
    }, [fileBeritaAcara])

    useEffect(() => {
        if (!fileAnggaran) {
            setPreviewAnggaran(jobdesk.laporanAnggaran)
            return
        }
        const objectUrlAnggaran = URL.createObjectURL(fileAnggaran)
        setPreviewAnggaran(objectUrlAnggaran)

        return () => URL.revokeObjectURL(objectUrlAnggaran)
    }, [fileAnggaran])

    useEffect(() => {
        const selectedData= dataKaryawan.filter((option: any) => team.includes(option.value));
        setSelectedOptions(selectedData);
    }, [team, dataKaryawan]);

    const handleSelectChange = (selectedOptions: any) => {
        setTeam(selectedOptions.map((option: any) => option.value));
        const terpilih = JSON.stringify(selectedOptions)
        setNamaterpilih(terpilih)
    };

    const DivisiAwal = () => {
        setDivisi(karyawanTb.divisi)
        const xxx: any = karyawan.filter(
            (item: any) => item.divisi && item.divisi.toLowerCase().includes(karyawanTb.divisi.toLowerCase()),
        );
        setSelectkaryawan(xxx)
    }

    const onDivisi = (e: any) => {
        setDivisi(e.target.value)
        const xxx: any = karyawan.filter(
            (item: any) => item.divisi && item.divisi.toLowerCase().includes(e.target.value.toLowerCase()),
        );
        setSelectkaryawan(xxx)
    }

    const KaryawanAwal = () => {
        setKaryawanId(String(jobdesk.karyawanId));
        const xxx = karyawan.filter(
            (item: any) => item.id !== jobdesk.karyawanId,
        );
        const options: any = xxx.map((item: any) => ({
            value: item.id,
            label: item.nama,
        }));
        setDataKaryawan(options)
    }

    const onKaryawan = (e: any) => {
        setKaryawanId(e.target.value);
        const xxx = karyawan.filter(
            (item: any) => item.id !== Number(e.target.value),
        );
        const options: any = xxx.map((item: any) => ({
            value: item.id,
            label: item.nama,
        }));
        setDataKaryawan(options)
    }

    const refreshform = () => {
        setNamajob(jobdesk.namaJob)
        setKeterangan(jobdesk.keterangan)
        setTanggalMulai(moment(jobdesk.tanggalMulai).format("YYYY-MM-DD"))
        setDeadline(moment(jobdesk.deadline).format("YYYY-MM-DD"))
        setKaryawanId(String(jobdesk.karyawanId))
        setDivisi(String(karyawanTb.divisi))
        const dataNamaTeam = JSON.parse(jobdesk.namaTeam);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setTeam(valuesArray)
        KaryawanAwal()
        DivisiAwal()
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        const newsurat = previewSurat === cekpreviewSurat ? 'no' : 'yes'
        const newberita = previewBerita === cekpreviewBerita ? 'no' : 'yes'
        const newanggaran = previewAnggaran === cekpreviewAnggaran ? 'no' : 'yes'
        try {
            const formData = new FormData()
            formData.append('namaJob', namaJob)
            formData.append('keterangan', keterangan)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('deadline', new Date(deadline).toISOString())
            formData.append('karyawanId', karyawanId)
            formData.append('status', status)
            formData.append('divisi', divisi)
            formData.append('team', String(team))
            formData.append('namaterpilih', namaterpilih)
            formData.append('newsurat', newsurat)
            formData.append('newberita', newberita)
            formData.append('newanggaran', newanggaran)
            formData.append('fileSuratTugas', fileSuratTugas as File)
            formData.append('fileBeritaAcara', fileBeritaAcara as File)
            formData.append('fileAnggaran', fileAnggaran as File)

            if (newsurat === 'yes') {
                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`file/${jobdesk.suratTugas}`]);

                const fileSuratTugas2 = formData.get('fileSuratTugas') as File;
                const namaunikSurat = Date.now() + '-' + fileSuratTugas2.name
                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`file/${namaunikSurat}`, fileSuratTugas2);
                formData.append('namaunikSurat', namaunikSurat)
            }

            if (newberita === 'yes') {
                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`file/${jobdesk.beritaAcara}`]);

                const fileBeritaAcara2 = formData.get('fileBeritaAcara') as File;
                const namaunikBerita = Date.now() + '-' + fileBeritaAcara2.name
                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`file/${namaunikBerita}`, fileBeritaAcara2);
                formData.append('namaunikBerita', namaunikBerita)
            }

            if (newanggaran === 'yes') {
                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`file/${jobdesk.laporanAnggaran}`]);

                const fileAnggaran2 = formData.get('fileAnggaran') as File;
                const namaunikAnggaran = Date.now() + '-' + fileAnggaran2.name
                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`file/${namaunikAnggaran}`, fileAnggaran2);
                formData.append('namaunikAnggaran', namaunikAnggaran)
            }

            const xxx = await axios.patch(`/admin/api/tambahtugas/${jobdesk.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'berhasil') {
                setShow(false);
                reload()
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil diubah',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <span onClick={handleShow} className="btn btn-success shadow btn-xs sharp mx-1"><i className="fa fa-edit"></i></span>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Data Tugas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Divisi</label>

                                <select
                                    required
                                    className="form-control"
                                    value={divisi} onChange={onDivisi}>
                                    <option value={''}> Pilih Divisi</option>
                                    <option value={'Admin'}>Admin</option>
                                    <option value={'Marketing'}>Marketing</option>
                                    <option value={'PIC'}>PIC</option>
                                    <option value={'Logistik'}>Logistik</option>
                                    <option value={'Teknisi'}>Teknisi</option>
                                </select>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label">Karyawan</label>
                                {divisi === '' ?
                                    <select
                                        className="form-control">
                                        <option value={''}> Menunggu pilih divisi</option>
                                    </select>
                                    :
                                    <select
                                        required
                                        className="form-control"
                                        value={karyawanId} onChange={onKaryawan}>
                                        <option value={''}> Pilih Karyawan</option>
                                        {selectkaryawan?.map((item: any, i) => (
                                            <option key={i} value={item.id} >{item.nama}</option>
                                        ))}
                                    </select>
                                }
                            </div>
                        </div>
                        {karyawanId !== '' ?
                            <div className="row">
                                <div className="mb-3 col-md-12">
                                    <label className="form-label" >Team</label>
                                    <Select
                                        required
                                        isMulti
                                        options={dataKaryawan}
                                        value={dataKaryawan.filter((option: any) => team.includes(option.value))}
                                        onChange={handleSelectChange}
                                    />
                                </div>
                            </div> :
                            null
                        }


                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" >Nama Tugas</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    value={namaJob} onChange={(e) => setNamajob(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" >Deskripsi</label>
                                <textarea
                                    required
                                    className="form-control"
                                    value={keterangan} onChange={(e) => setKeterangan(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" >Tanggal Mulai</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" >Deadline</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                />
                            </div>


                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" >Status</label>
                                <select
                                    required
                                    className="form-control"
                                    value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value={''}></option>
                                    <option value={'Proses'}>Proses</option>
                                    <option value={'Verifikasi'}>Verifikasi</option>

                                </select>
                            </div>

                           
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" >Upload Surat Tugas</label>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".docx, .xlsx"
                                    className="form-control"
                                    onChange={(e) => setFileSurattugas(e.target.files?.[0])}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" >Upload Berita Acara</label>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".docx, .xlsx"
                                    className="form-control"
                                    onChange={(e) => setFileBeritaacara(e.target.files?.[0])}
                                />
                            </div>
                        </div>


                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" >Upload Laporan Anggaran</label>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".docx, .xlsx"
                                    className="form-control"
                                    onChange={(e) => setFileAnggaran(e.target.files?.[0])}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default Update