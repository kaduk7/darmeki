/* eslint-disable @next/next/no-img-element */
"use client"
import { useState} from "react"
import {  KaryawanTb } from "@prisma/client"
import Modal from 'react-bootstrap/Modal';
import moment from "moment"
import { supabaseUrl, supabaseBUCKET } from '@/app/helper'

function Cek({ karyawan }: { karyawan: KaryawanTb}) {
    const nama = karyawan.nama
    const tempatLahir = (karyawan?.tempatLahir || "")
    const tanggalLahir = (moment(karyawan?.tanggalLahir).format("DD-MM-YYYY"))
    const alamat = (karyawan?.alamat || "")
    const hp = (karyawan.hp)
    const preview = (karyawan?.foto)
    const password = ("")
    const email = (karyawan.email)
    const namadivisi = (karyawan.divisi)
    const ktplama =(karyawan?.ktp)
    const cvlama = (karyawan?.CV)
    const ijazahlama = (karyawan?.ijazah)
    
    const [show, setShow] = useState(false)
    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => {
        setShow(true);
    }


    return (
        <>
            <span onClick={handleShow} className="btn btn-info shadow btn-xs sharp mx-1"><i className="fa fa-eye"></i></span>
            <Modal
                dialogClassName="modal-xl"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form >
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "black" }}>Data Karyawan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4">
                                <div className="clearfix">
                                    <div className="card card-bx profile-card author-profile m-b30">
                                        <div className="card-body">
                                            <div className="p-5">
                                                <div className="author-profile">
                                                    <div className="author-media">
                                                        {<img src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${preview}`} alt={""} className="mb-3 " width={200} height={200} />}
                                                    </div>

                                                    <div className="author-info">
                                                        <h6 className="title">{nama}</h6>
                                                        <span>{namadivisi}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="info-list">
                                                <ul>
                                                    <li >
                                                        <a >Scan KTP</a>
                                                        <div className='col-30'>
                                                            <a className="btn btn-primary" href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${ktplama}`} target="_blank">
                                                                Download
                                                            </a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a  >Resume CV</a>
                                                        <div className='col-30'>
                                                            <a className="btn btn-primary" href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${cvlama}`} target="_blank">
                                                                Download
                                                            </a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a  >Scan Ijazah</a>
                                                        <div className='col-30'>
                                                            <a className="btn btn-primary" href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${ijazahlama}`} target="_blank">
                                                                Download
                                                            </a>
                                                        </div>
                                                    </li>

                                                </ul>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-9 col-lg-8">
                                <div className="card profile-card card-bx m-b30">
                                    <form className="profile-form">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-12 m-b30">
                                                    <label className="form-label">Nama</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={nama}
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">Tempat Lahir</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={tempatLahir}
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">Tanggal Lahir</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={tanggalLahir}
                                                    />
                                                </div>
                                                <div className="col-sm-12 m-b30">
                                                    <label className="form-label">Alamat</label>
                                                    <textarea
                                                        disabled
                                                        rows={3}
                                                        className="form-control"
                                                        value={alamat}
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">No Hp</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={hp}
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        disabled
                                                        required
                                                        type="text"
                                                        className="form-control"
                                                        value={email}
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">Password</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={password}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default Cek