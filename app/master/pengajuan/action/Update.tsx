/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { RequestJobdeskTb } from "@prisma/client"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { useSession } from "next-auth/react";
import Select from 'react-select';
import { StyleSelect } from "@/app/helper"

function Update({ jobdesk, reload, datateam }: { jobdesk: RequestJobdeskTb, reload: Function, datateam: Array<never> }) {
    const session = useSession()
    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [tanggalMulai, setTanggalMulai] = useState(moment(jobdesk.tanggalMulai).format("YYYY-MM-DD"))
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("YYYY-MM-DD"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [team, setTeam] = useState<string[]>(["1"]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [namaterpilih, setNamaterpilih] = useState('');
    const [show, setShow] = useState(false);
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

    const handleShow = () => setShow(true);

    useEffect(() => {
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setTeam(valuesArray)
        setNamaterpilih(namaTeam)
    }, [])

    useEffect(() => {
        const selectedData = datateam.filter((option: any) => team.includes(option.value));
        setSelectedOptions(selectedData);

    }, [team, datateam]);

    const handleSelectChange = (selectedOptions: any) => {
        setTeam(selectedOptions.map((option: any) => option.value));
        const terpilih = JSON.stringify(selectedOptions)
        setNamaterpilih(terpilih)
    };

    const refreshform = () => {
        setNamajob(jobdesk.namaJob)
        setKeterangan(jobdesk.keterangan)
        setDeadline(moment(jobdesk.deadline).format("YYYY-MM-DD"))
        const dataNamaTeam = JSON.parse(jobdesk.namaTeam);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setTeam(valuesArray)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append('namaJob', namaJob)
            formData.append('keterangan', keterangan)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('deadline', new Date(deadline).toISOString())
            formData.append('namaterpilih', namaterpilih)
            formData.append('team', String(team))

            const xxx = await axios.patch(`/master/api/requestjobdesk/${jobdesk.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                if (xxx.data.pesan == 'tidak bisa diedit') {

                    Swal.fire({
                        position: 'top-end',
                        icon: 'warning',
                        title: 'Data yang sudah di Acc Tidak bisa diedit',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    handleClose()
                    setIsLoading(false)
                    reload()
                }
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
                        <Modal.Title >Update Data Pengajuan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="col-md-12 col-xl-12 col-xxl-12 mb-3">
                            <label className="form-label" style={{ color: "black" }}>Nama Tugas</label>
                            <div className="input-group">
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    value={namaJob} onChange={(e) => setNamajob(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black" }}>Team</label>
                                <Select
                                    required
                                    isMulti
                                    options={datateam}
                                    value={datateam.filter((option: any) => team.includes(option.value))}
                                    onChange={handleSelectChange}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Tanggal Mulai</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{  color: "black" }}>Deadline</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-12 col-xl-12 col-xxl-12 mb-3">
                            <label className="form-label" style={{ color: "black" }}>Keterangan</label>
                            <div className="input-group">
                                <textarea
                                    required
                                    className="form-control"
                                    value={keterangan} onChange={(e) => setKeterangan(e.target.value)}
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