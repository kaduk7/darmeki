/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { JobdeskTb, KaryawanTb } from "@prisma/client"
import Modal from 'react-bootstrap/Modal';
import moment from "moment"

function Cek({ jobdesk, findkaryawan }: { jobdesk: JobdeskTb, findkaryawan: KaryawanTb }) {

    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("DD-MM-YYYY"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [status, setStatus] = useState(jobdesk.status)
    const [namakaryawan, setNamakaryawan] = useState(findkaryawan.nama)
    const [alasan, setAlasan] = useState(jobdesk?.alasan)
    const [namateam, setNamateam] = useState('');
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => {
        setShow(true);
        refreshform()
    }

    useEffect(() => {
        tampilteam()
    })

    const tampilteam = () => {
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const labelArray = dataNamaTeam.map((item: any) => item.label);
        setNamateam(labelArray.join(', '))
    }

    const refreshform = () => {
        setNamajob(jobdesk.namaJob)
        setKeterangan(jobdesk.keterangan)
        setDeadline(moment(jobdesk.deadline).format("DD-MM-YYYY"))
        setStatus(jobdesk.status)
        setAlasan(jobdesk?.alasan)
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
                        <Modal.Title >Cek Data Pengajuan</Modal.Title>
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
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama jobdesk </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {namaJob}
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
                                    <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deadline </div>
                                    <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                        {deadline}
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
                                        status === "Dalam Proses" ?
                                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "blue" }}>
                                                {status}
                                            </div>
                                            :
                                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "yellow" }}>
                                                {status}
                                            </div>
                                    }
                                </div>

                                {jobdesk.status === "Tolak" ?
                                    <div className="mb-3 row">
                                        <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Alasan </div>
                                        <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                        <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                            {alasan}
                                        </div>
                                    </div>
                                    :
                                    null
                                }
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