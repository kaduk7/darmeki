/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { tanggalHariIni } from "@/app/helper";

function Add({ reload }: { reload: Function }) {
    const session = useSession()
    const [nip, setNip] = useState("")
    const [nama, setNama] = useState("")
    const [tempatLahir, setTempatlahir] = useState("")
    const [tanggalLahir, setTanggallahir] = useState(tanggalHariIni)
    const [alamat, setAlamat] = useState("")
    const [hp, setHp] = useState("")
    const [email, setEmail] = useState("")
    const [jekel, setJekel] = useState("")

    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const refemail = useRef<HTMLInputElement>(null);
    const refhp = useRef<HTMLInputElement>(null);
    const router = useRouter()

    const setfokusemail = () => {
        refemail.current?.focus();
    }

    const setfokushp = () => {
        refhp.current?.focus();
    }

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    const handleShow = () => setShow(true);
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

    useEffect(() => {
        ref.current?.focus();
    }, [])

    function clearForm() {
        setNama('')
        setNip('')
        setTempatlahir('')
        setTanggallahir(tanggalHariIni)
        setAlamat('')
        setHp('')
        setEmail('')
        setJekel('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {

        setIsLoading(true)
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('NIP', nip)
            formData.append('nama', nama)
            formData.append('tempatlahir', tempatLahir)
            formData.append('tanggallahir', new Date(tanggalLahir).toISOString())
            formData.append('alamat', alamat)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('jekel', jekel)
            const xxx = await axios.post(`/admin/api/karyawan`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'Email sudah ada') {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Email sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    setfokusemail()
                }, 1500);
            }
            if (xxx.data.pesan == 'No Hp sudah ada') {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'No Hp sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    setfokushp()
                }, 1600);
            }

            if (xxx.data.pesan == 'berhasil') {
                handleClose();
                clearForm();
                reload()
                router.refresh()
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
                <i className=""></i>Tambah Karyawan</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title >Tambah Data Karyawan</Modal.Title>
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
                                    ref={refemail}
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
                                    ref={refhp}
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
        </div>
    )
}

export default Add