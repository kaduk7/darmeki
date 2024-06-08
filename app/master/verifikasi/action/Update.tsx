/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { JobdeskTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"

function Update({ jobdesk,reload }: { jobdesk: JobdeskTb,reload:Function }) {

    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [tanggalMulai, setTanggalMulai] = useState(moment(jobdesk.tanggalMulai).format("DD-MM-YYYY"))
    const [namateam, setNamateam] = useState('');
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("YYYY-MM-DD"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [alasan, setAlasan] = useState("")
    const router = useRouter()
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
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

    useEffect(() => {
        tampilTeam();
    }, [])


    const tampilTeam = async () => {
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const labelArray = dataNamaTeam.map((item: any) => item.label);
        setNamateam(labelArray.join(', '))
    }

    const handleClose2 = () => {

        setShow2(false);
        refreshform()
    }

    const handleShow = () => setShow(true);
    const handleShow2 = () => setShow2(true);

    const klikTolak = async (e: SyntheticEvent) => {
        e.preventDefault()
        handleShow2()
    }

    const handleTolak = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        const konfirm = 'tolak'
        try {
            const formData = new FormData()
            formData.append('alasan', alasan)
            formData.append('konfirm', konfirm)
            const xxx = await axios.patch(`/master/api/verifikasi/${jobdesk.id}`, formData, {
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
                    setIsLoading(false)
                    reload()
                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleTerima = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        const konfirm = 'terima'
        try {
            const formData = new FormData()
            formData.append('konfirm', konfirm)
            const xxx = await axios.patch(`/master/api/verifikasi/${jobdesk.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setTimeout(function () {
                if (xxx.data.pesan == 'berhasil') {
                    setShow(false);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil diubah',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setIsLoading(false)
                    reload()
                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const refreshform = () => {
        setNamajob(jobdesk.namaJob)
        setKeterangan(jobdesk.keterangan)
        setDeadline(moment(jobdesk.deadline).format("YYYY-MM-DD"))
        setTanggalMulai(moment(jobdesk.tanggalMulai).format("YYYY-MM-DD"))
    }


    return (
        <>
            <span onClick={handleShow} className="btn btn-success shadow btn-xs sharp mx-1"><i className="fa fa-eye"></i></span>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title >Verifikasi Tugas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card profile-card card-bx m-b30">
                            <div className="card-body">
                                <div className="mb-3 row">
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Tugas </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {namaJob}
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
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={klikTolak}>Tolak</button>
                        <button type="button" className="btn btn-primary light" onClick={handleTerima}>Terima</button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal
                dialogClassName="modal-m"
                show={show2}
                onHide={handleClose2}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleTolak}>
                    <Modal.Header closeButton>
                        <Modal.Title >Alasan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black"}}>Keterangan</label>
                                <textarea

                                    required
                                    className="form-control"
                                    value={alasan} onChange={(e) => setAlasan(e.target.value)}
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

export default Update