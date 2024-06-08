/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { JobdeskTb, KaryawanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { Editor } from '@tinymce/tinymce-react';
import { supabase, supabaseUrl, supabaseBUCKET } from "@/app/helper";

function Cek({ jobdesk, findkaryawan }: { jobdesk: JobdeskTb, findkaryawan: KaryawanTb }) {
    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("DD-MM-YYYY"))
    const [tanggalMulai, setTanggalMulai] = useState(moment(jobdesk.tanggalMulai).format("DD-MM-YYYY"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [status, setStatus] = useState(jobdesk.status)
    const [karyawanId, setKaryawanId] = useState(String(jobdesk.karyawanId))
    const [namakaryawan, setNamakaryawan] = useState(findkaryawan.nama)
    const [namateam, setNamateam] = useState('');

    const [tanggalkerjaValue, setTanggalkerjaValue] = useState(moment(jobdesk?.tanggalPelaksanaan).format("DD-MM-YYYY"))
    const [fileValue, setFileValue] = useState(jobdesk?.file)
    const [keteranganAkhirValue, setKeteranganAkhirValue] = useState(jobdesk?.keteranganAkhir)

    const [fileSuratTugasValue, setFileSuratTugasValue] = useState(jobdesk.suratTugas)
    const [fileBeritaAcaraValue, setFileBeritaAcaraValue] = useState(jobdesk.beritaAcara)
    const [fileAnggaranValue, setFileAnggaranValue] = useState(jobdesk.laporanAnggaran)

    const [fileSuratTugas, setFileSuratTugas] = useState<File | null>()
    const [fileBeritaAcara, setFileBeritaAcara] = useState<File | null>()
    const [fileAnggaran, setFileAnggaran] = useState<File | null>()

    const [file, setFile] = useState<File | null>()
    const [tanggalkerja, setTanggalkerja] = useState('')
    const [keteranganAkhir, setKeteranganAkhir] = useState("")

    const router = useRouter()
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose = () => {
        setShow(false);
        setShow2(false);
        refreshform()
    }

    const handleClose2 = () => {
        setShow2(false);
    }

    const handleInput = () => {
        handleShow2()
    }

    const handleShow = () => {
        setShow(true);
        refreshform();
    }
    const handleShow2 = () => setShow2(true);

    useEffect(() => {
        tampilTeam();
    })

    const handleEditorChange = (content: any, editor: any) => {
        setKeteranganAkhir(content);;
    }

    const tampilTeam = async () => {
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const labelArray = dataNamaTeam.map((item: any) => item.label);
        setNamateam(labelArray.join(', '))
    }

    const refreshform = () => {
        setFileSuratTugasValue(jobdesk.suratTugas)
        setFileBeritaAcaraValue(jobdesk.beritaAcara)
        setFileAnggaranValue(jobdesk.laporanAnggaran)
        setTanggalkerjaValue(moment(jobdesk?.tanggalPelaksanaan).format("DD-MM-YYYY"))
        setFileValue(jobdesk?.file)
        setStatus(jobdesk.status)
        setKeteranganAkhirValue(jobdesk?.keteranganAkhir)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        Swal.fire({
            title: "Mohon tunggu!",
            html: "Sedang validasi data",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },

        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
            }
        });

        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('tanggalkerja', new Date(tanggalkerja).toISOString())
            formData.append('file', file as File)
            formData.append('fileSurat', fileSuratTugas as File)
            formData.append('fileBerita', fileBeritaAcara as File)
            formData.append('fileAnggaran', fileAnggaran as File)
            formData.append('keteranganAkhir', keteranganAkhir)

            await supabase.storage
                .from(supabaseBUCKET)
                .remove([`file/${jobdesk.suratTugas}`]);

            await supabase.storage
                .from(supabaseBUCKET)
                .remove([`file/${jobdesk.beritaAcara}`]);

            await supabase.storage
                .from(supabaseBUCKET)
                .remove([`file/${jobdesk.laporanAnggaran}`]);

            const file2 = formData.get('file') as File;
            const namaunik = Date.now() + '-' + file2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunik}`, file2);

            const fileSuratTugas2 = formData.get('fileSurat') as File;
            const namaunikSurat = Date.now() + '-' + fileSuratTugas2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikSurat}`, fileSuratTugas2);


            const fileBeritaAcara2 = formData.get('fileBerita') as File;
            const namaunikBerita = Date.now() + '-' + fileBeritaAcara2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikBerita}`, fileBeritaAcara2);

            const fileAnggaran2 = formData.get('fileAnggaran') as File;
            const namaunikAnggaran = Date.now() + '-' + fileAnggaran2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikAnggaran}`, fileAnggaran2);

            formData.append('namaunik', namaunik)
            formData.append('namaunikSurat', namaunikSurat)
            formData.append('namaunikBerita', namaunikBerita)
            formData.append('namaunikAnggaran', namaunikAnggaran)

            const xxx = await axios.patch(`/master/api/selesaijob/${jobdesk.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setTimeout(function () {
                if (xxx.data.pesan == 'berhasil') {
                    setShow(false);
                    setShow2(false);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil diubah',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(function () {
                        router.refresh()
                    }, 1500);
                }
                refreshform();
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <span onClick={handleShow} className="btn btn-info shadow btn-xs sharp mx-1"><i className="fa fa-eye"></i></span>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Detail Tugas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card profile-card card-bx m-b30">
                            <div className="card-body">
                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Karyawan </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {namakaryawan}
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Team </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {namateam}
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Tugas </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {namaJob}
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Tanggal Mulai </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {tanggalMulai}
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deadline </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {deadline}
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deskripsi </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {keterangan}
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Status </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    {status === "Tolak" ?

                                        <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>
                                            {status}
                                        </div>
                                        :
                                        status === "Proses" ?
                                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "blue" }}>
                                                {status}
                                            </div>
                                            :
                                            status === "Dalam Proses" ?
                                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "blue" }}>
                                                    {status}
                                                </div>
                                                :
                                                status === "Selesai" ?
                                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "green" }}>
                                                        {status}
                                                    </div>
                                                    :
                                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "yellow" }}>
                                                        {status}
                                                    </div>
                                    }
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Surat Tugas </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <u className="col-sm-7" >
                                        <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/file/${fileSuratTugasValue}`} target="_blank" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>Download</a>
                                    </u>
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Berita Acara </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <u className="col-sm-7" >
                                        <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/file/${fileBeritaAcaraValue}`} target="_blank" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>Download</a>
                                    </u>
                                </div>

                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Laporan Anggaran </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <u className="col-sm-7" >
                                        <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/file/${fileAnggaranValue}`} target="_blank" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>Download</a>
                                    </u>
                                </div>

                                {jobdesk.status === "Selesai" ?
                                    <div className="mb-3 row">
                                        <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Tanggal Pelaksanaan </div>
                                        <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                        <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                            {tanggalkerjaValue}
                                        </div>
                                    </div>
                                    :
                                    null
                                }

                                {jobdesk.status === "Selesai" ?
                                    <div className="mb-3 row">
                                        <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>File Kegiatan </div>
                                        <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                        <u className="col-sm-7" >
                                            <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/file/${fileValue}`} target="_blank" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>Klik Disini</a>
                                        </u>
                                    </div>
                                    :
                                    null
                                }

                                {jobdesk.status === "Selesai" ?
                                    <div className="mb-3 row">
                                        <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Keterangan Akhir</div>
                                        <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                        <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                            {/* <div dangerouslySetInnerHTML={{ __html: keteranganAkhirValu
                                    e }}></div>
                                     */}
                                            <div dangerouslySetInnerHTML={{ __html: keteranganAkhirValue || '' }}></div>
                                        </div>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {jobdesk.status !== "Selesai" ?
                            <button type="button" className="btn btn-success light" onClick={handleInput}>Tugas Selesai</button>
                            :
                            null
                        }
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal
                dialogClassName="modal-lg"
                show={show2}
                onHide={handleClose2}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Input Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama jobdesk </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {namaJob}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Tanggal Mulai </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {tanggalMulai}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deadline </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {deadline}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Keterangan </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {keterangan}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Tanggal Pengerjaan</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tanggalkerja} onChange={(e) => setTanggalkerja(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload File</label>
                                <input
                                    type="file"
                                    id="inputGroupFile01"
                                    name="file"
                                    className="form-control"
                                    onChange={(e) => setFile(e.target.files?.[0])}
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                />
                            </div>

                            <div className="mb-3 col-md-4">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload Surat Tugas</label>
                                <input
                                    type="file"
                                    id="inputGroupFile01"
                                    name="file"
                                    className="form-control"
                                    onChange={(e) => setFileSuratTugas(e.target.files?.[0])}
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                />
                            </div>

                            <div className="mb-3 col-md-4">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload Berita Acara</label>
                                <input
                                    type="file"
                                    id="inputGroupFile01"
                                    name="file"
                                    className="form-control"
                                    onChange={(e) => setFileBeritaAcara(e.target.files?.[0])}
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                />
                            </div>

                            <div className="mb-3 col-md-4">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload Laporan Anggaran</label>
                                <input
                                    type="file"
                                    id="inputGroupFile01"
                                    name="file"
                                    className="form-control"
                                    onChange={(e) => setFileAnggaran(e.target.files?.[0])}
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Keterangan Akhir</label>
                                <Editor
                                    value={keteranganAkhir}
                                    initialValue=""
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | blocks |formatselect | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                    onEditorChange={handleEditorChange}
                                />
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose2}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default Cek