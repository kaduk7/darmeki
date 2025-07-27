/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { tanggalHariIni } from "@/app/helper";

function Add({ reload,dataulay }: { reload: Function ,dataulay: Array<any>}) {
    const session = useSession()
    const [nama, setNama] = useState("")
    const [UL, setUL] = useState("")
    const [password, setPassword] = useState("")
    const [usernama, setUsernama] = useState("")
    const [petugas, setPetugas] = useState("")

    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const refemail = useRef<HTMLInputElement>(null);
    const refhp = useRef<HTMLInputElement>(null);
    const [st, setSt] = useState(false);
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
        setUL('')
        setPassword('')
        setUsernama('')
        setPetugas('')
        setSt(false)
    }

    const handleSubmit = async (e: SyntheticEvent) => {

        setIsLoading(true)
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('UL', UL)
            formData.append('usernama', usernama)
            formData.append('password', password)
            formData.append('petugas', petugas)

            const xxx = await axios.post(`/admin/api/unit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'Usernama sudah ada') {
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
                <i className=""></i>Tambah</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title >Tambah Unit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black", borderColor: "grey" }}>Nama</label>
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
                                <label className="form-label" style={{ color: "black" }}>Unit Layanan</label>
                                 <select
                                    required
                                    className="form-control"
                                    value={UL} onChange={(e) => setUL(e.target.value)}>
                                    <option value={''} disabled={UL !== ''}> Pilih Unit Layanan</option>
                                    {dataulay?.map((item: any, i) => (
                                        <option key={i} value={item.id} >{item.nama}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Petugas</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={petugas} onChange={(e) => setPetugas(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Usernama</label>
                                <input
                                    required
                                    ref={refemail}
                                    type="text"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={usernama} onChange={(e) => setUsernama(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Password</label>
                                <div className="input-group input-success">
                                    <input
                                        required
                                        type={st ? "text" : "password"}
                                        className="form-control"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {st ?
                                        <button onClick={() => setSt(!st)} className="input-group-text border-0" type="button">
                                            <i className="mdi mdi-eye-off" />
                                        </button>
                                        :
                                        <button onClick={() => setSt(!st)} className="input-group-text border-0" type="button">
                                            <i className="mdi mdi-eye" />
                                        </button>
                                    }
                                </div>
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