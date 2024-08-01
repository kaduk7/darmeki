/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import Select from 'react-select';
import { supabase, supabaseBUCKET, supabaseUrl, StyleSelect, tanggalHariIni, mingguDepan } from "@/app/helper";

function Add({ reload, karyawan }: { reload: Function, karyawan: Array<any> }) {
    const [namaJob, setNamajob] = useState("")
    const [tanggalMulai, setTanggalMulai] = useState(tanggalHariIni)
    const [deadline, setDeadline] = useState(mingguDepan)
    const [keterangan, setKeterangan] = useState("")
    const [status, setStatus] = useState("")
    const [divisi, setDivisi] = useState("")
    const [karyawanId, setKaryawanId] = useState("")
    const [selectkaryawan, setSelectkaryawan] = useState([])
    const [fileSuratTugas, setFileSurattugas] = useState<File | null>()
    const [fileBeritaAcara, setFileBeritaacara] = useState<File | null>()
    const [fileAnggaran, setFileAnggaran] = useState<File | null>()
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const [team, setTeam] = useState<string[]>([]);
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

    const handleShow = () => setShow(true);

    const handleSelectChange = (selectedOptions: any) => {
        setTeam(selectedOptions.map((option: any) => option.value));
        const terpilih = JSON.stringify(selectedOptions)
        setNamaterpilih(terpilih)
    };

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    useEffect(() => {
        ref.current?.focus();

    }, [])

    const onDivisi =  (e: any) => {
        setDivisi(e.target.value)
        const xxx: any = karyawan.filter(
            (item: any) => item.divisi && item.divisi.toLowerCase().includes(e.target.value.toLowerCase()),
        );
        setSelectkaryawan(xxx)
    }

    const onKaryawan =  (e: any) => {
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

    function clearForm() {
        setNamajob('')
        setTanggalMulai(tanggalHariIni)
        setDeadline(mingguDepan)
        setKeterangan('')
        setStatus('')
        setKaryawanId('')
        setDivisi('')
        setSelectkaryawan([])
        setTeam([])
        setNamaterpilih('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('namaJob', namaJob)
            formData.append('keterangan', keterangan)
            formData.append('status', status)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('deadline', new Date(deadline).toISOString())
            formData.append('karyawanId', karyawanId)
            formData.append('team', String(team))
            formData.append('namaterpilih', namaterpilih)
            formData.append('fileSuratTugas', fileSuratTugas as File)
            formData.append('fileBeritaAcara', fileBeritaAcara as File)
            formData.append('fileAnggaran', fileAnggaran as File)

            const fileSuratTugas2 = formData.get('fileSuratTugas') as File;
            const namaunikSurat = Date.now() + '-' + fileSuratTugas2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikSurat}`, fileSuratTugas2);

            const fileBeritaAcara2 = formData.get('fileBeritaAcara') as File;
            const namaunikBerita = Date.now() + '-' + fileBeritaAcara2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikBerita}`, fileBeritaAcara2);

            const fileAnggaran2 = formData.get('fileAnggaran') as File;
            const namaunikAnggaran = Date.now() + '-' + fileAnggaran2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikAnggaran}`, fileAnggaran2);

            formData.append('namaunikSurat', namaunikSurat)
            formData.append('namaunikBerita', namaunikBerita)
            formData.append('namaunikAnggaran', namaunikAnggaran)

            const xxx = await axios.post(`/admin/api/tambahtugas`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'berhasil') {
                handleClose();
                clearForm();
                reload()
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil Simpan',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                <i className=""></i>Buat Tugas</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data Tugas</Modal.Title>
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
                                    required
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
                                    required
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
                                    required
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
        </div>
    )
}

export default Add

