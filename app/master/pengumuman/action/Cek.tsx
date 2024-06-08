/* eslint-disable @next/next/no-img-element */
"use client"
import { useState} from "react"
import {  PengumumanTb } from "@prisma/client"
import Modal from 'react-bootstrap/Modal';
import moment from "moment"

function Cek({ pengumuman }: { pengumuman: PengumumanTb }) {

    const [judul, setJudul] = useState(pengumuman.judul)
    const [tanggalPengumuman, setTanggalPengumuman] = useState(moment(pengumuman.tanggalPengumuman).format("DD-MM-YYYY"))
    const [isi, setIsi] = useState(pengumuman.isi)

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => {
        setShow(true);
        refreshform();
    }

    const refreshform = () => {
        setJudul(pengumuman.judul)
        setTanggalPengumuman(moment(pengumuman.tanggalPengumuman).format("DD-MM-YYYY"))
        setIsi(pengumuman.isi)
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
                        <Modal.Title>Pengumuman</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Judul </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {judul}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Tanggal </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {tanggalPengumuman}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deskripsi </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                <div dangerouslySetInnerHTML={{ __html: isi }}></div>
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