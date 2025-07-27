/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import {UnitTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { useSession } from "next-auth/react"

function Update({ unit, reload,dataulay }: { unit: UnitTb,  reload: Function,dataulay: Array<any> }) {
    const session = useSession()
    const [nama, setNama] = useState(unit.nama)
    const [UL, setUL] = useState(String(unit.ULId))
    const [password, setPassword] = useState("")
    const [usernama, setUsernama] = useState(unit.usernama)
    const [petugas, setPetugas] = useState(unit.petugas)

    const [st, setSt] = useState(false);
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
        setNama(unit.nama)
        setUL(String(unit.ULId))
        setUsernama(unit.usernama)
        setPetugas(unit.petugas)
        setPassword('')
    }

    const hapuspass = () => {
        setPassword('')
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        const newpass = password == "" ? 'no' : 'yes'
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('UL', UL)
            formData.append('usernama', usernama)
            formData.append('password', password)
            formData.append('newpass', newpass)
            formData.append('petugas', petugas)

            const xxx = await axios.patch(`/admin/api/unit/${unit.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'sudah ada usernama') {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Usernama ini sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

            if (xxx.data.pesan == 'berhasil') {
                setShow(false);
                setIsLoading(false)
                hapuspass()
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
                        <Modal.Title style={{ color: "black" }}>Edit Unit</Modal.Title>
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
        </>
    )
}

export default Update