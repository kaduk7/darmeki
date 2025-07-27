/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import { KaryawanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { useSession } from "next-auth/react"

function Update({ karyawan, reload }: { karyawan: KaryawanTb, reload: Function }) {
    const session = useSession()
    const [nama, setNama] = useState(karyawan.nama)
    const [nip, setNip] = useState(karyawan.NIP)
    const [tempatLahir, setTempatlahir] = useState(karyawan?.tempatLahir || "")
    const [tanggalLahir, setTanggallahir] = useState(moment(karyawan?.tanggalLahir).format("YYYY-MM-DD"))
    const [alamat, setAlamat] = useState(karyawan?.alamat || "")
    const [hp, setHp] = useState(karyawan.hp)
    const [email, setEmail] = useState(karyawan.email)
    const [jekel, setJekel] = useState(karyawan.jekel)

    const [show, setShow] = useState(false)
    const router = useRouter()

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => {
        setShow(true);
    }

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

    const refreshform = () => {
        setNama(karyawan.nama)
        setNip(karyawan.NIP)
        setTempatlahir(karyawan?.tempatLahir || '')
        setTanggallahir(moment(karyawan?.tanggalLahir).format("YYYY-MM-DD"))
        setAlamat(karyawan?.alamat || '')
        setHp(karyawan.hp)
        setEmail(karyawan.email)
        setJekel(karyawan.jekel)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('NIP', nip)
            formData.append('tempatlahir', tempatLahir)
            formData.append('tanggallahir', new Date(tanggalLahir).toISOString())
            formData.append('alamat', alamat)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('jekel', jekel)
            const xxx = await axios.patch(`/admin/api/karyawan/${karyawan.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'sudah ada email') {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Email ini sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

            if (xxx.data.pesan == 'sudah ada hp') {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'No Hp ini sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })

            }
            if (xxx.data.pesan == 'berhasil') {
                setShow(false);
                setIsLoading(false)
                reload()
                router.refresh()
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
                        <Modal.Title style={{ color: "black" }}>Edit Data Karyawan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black", borderColor: "grey" }}>Nama Karyawan</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black", borderColor: "grey" }}>NIP</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={nip} onChange={(e) => setNip(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Email</label>
                                <input
                                    required
                                    type="email"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>No Hp</label>
                                <input
                                    required
                                    type="number"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={hp} onChange={(e) => setHp(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Jenis Kelamin</label>
                                <select
                                    required
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    className="form-control"
                                    value={jekel} onChange={(e) => setJekel(e.target.value)}>
                                    <option value="" disabled={jekel !== ''}>Pilihan</option>
                                    <option value={'Pria'}>Pria</option>
                                    <option value={'Wanita'}>Wanita</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Tempat Lahir</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={tempatLahir} onChange={(e) => setTempatlahir(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Tanggal Lahir</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={tanggalLahir} onChange={(e) => setTanggallahir(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="row  mb-3">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black" }}>Alamat</label>
                                <textarea
                                    required
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={alamat} onChange={(e) => setAlamat(e.target.value)}
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