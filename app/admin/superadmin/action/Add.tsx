/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

function Add({reload}:{reload:Function}) {

    const [nama, setNama] = useState("")
    const [password, setPassword] = useState("")
    const [hp, setHp] = useState("")
    const [email, setEmail] = useState("")
    const [divisi, setDivisi] = useState("")
    const [namadivisi, setNamadivisi] = useState("")
    const [selectdivisi, setSelectdivisi] = useState([])

    const [karyawanCekValue, setKaryawanCekValue] = useState("Ya")
    const [informasiCekValue, setInformasiCekValue] = useState("Ya")
    const [jobdeskCekValue, setJobdeskCekValue] = useState("Ya")

    const router = useRouter()
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const refemail = useRef<HTMLInputElement>(null);
    const refhp = useRef<HTMLInputElement>(null);
    const [st, setSt] = useState(false);


    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        ref.current?.focus();
    }, [])


    function clearForm() {
        setNama('')
        setHp('')
        setPassword('')
        setEmail('')
        setDivisi('')
        setSt(false)
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('divisi', divisi)
            formData.append('namadivisi', namadivisi)
            formData.append('karyawanCekValue', karyawanCekValue)
            formData.append('informasiCekValue', informasiCekValue)
            formData.append('jobdeskCekValue', jobdeskCekValue)

            const xxx = await axios.post(`/admin/api/superadmin`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'berhasil') {
                handleClose();
                reload()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil Simpan',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    clearForm();
                    router.refresh()
                }, 1500);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

  


    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                <i className="mdi mdi-plus-box"></i>Add Karyawan</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "monospace", fontSize: 30, color: "black" }}>Tambah Data Karyawan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Nama Karyawan</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>No Hp</label>
                                <input
                                    required
                                    ref={refhp}
                                    type="number"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={hp} onChange={(e) => setHp(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Divisi</label>
                                <select
                                    required
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    className="form-control"
                                    value={divisi} onChange={(e) => setDivisi(e.target.value)}>
                                    <option value={''}> Pilih Divisi</option>
                                    <option value={'Admin'}>Admin</option>
                                    <option value={'Marketing'}>Marketing</option>
                                    <option value={'PIC'}>PIC</option>
                                    <option value={'Logistik'}>Logistik</option>
                                    <option value={'Teknisi'}>Teknisi</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Email</label>
                                <input
                                    required
                                    ref={refemail}
                                    type="email"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Password</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type={st ? "text" : "password"}
                                        className="form-control"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {st ?
                                        <button onClick={() => setSt(!st)} className="btn btn-success" type="button">
                                            <i className="mdi mdi-eye-off" />
                                        </button>
                                        :
                                        <button onClick={() => setSt(!st)} className="btn btn-success" type="button">
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