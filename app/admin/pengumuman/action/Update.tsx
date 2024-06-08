/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import { PengumumanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import { StyleSelect, scroll } from "@/app/helper"

function Update({ pengumuman, reload, daftardivisi }: { pengumuman: PengumumanTb, reload: Function, daftardivisi: Array<never> }) {
    const [judul, setJudul] = useState(pengumuman.judul)
    const [tanggalPengumuman, setTanggalPengumuman] = useState(moment(pengumuman.tanggalPengumuman).format("YYYY-MM-DD"))
    const [isi, setIsi] = useState(pengumuman.isi)
    const [divisi, setDivisi] = useState<string[]>([]);
    const [selectdivisiId, setSelectDivisiId] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
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

    const [show, setShow] = useState(false)

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        mencaridivisi();
    }, [])

    useEffect(() => {
        const selectedData = daftardivisi.filter((option: any) => divisi.includes(option.value));
        setSelectedOptions(selectedData);
    }, [divisi, daftardivisi]);


    async function mencaridivisi() {
        const namadivisi: any = pengumuman.divisi
        setDivisi(namadivisi)
    }

    const handleSelectChange = (selectedOptions: any) => {
        setDivisi(selectedOptions.map((option: any) => option.value));
        setSelectDivisiId(selectedOptions)
    };

    const refreshform = async () => {
        setJudul(pengumuman.judul)
        setTanggalPengumuman(moment(pengumuman.tanggalPengumuman).format("YYYY-MM-DD"))
        setIsi(pengumuman.isi)
        mencaridivisi()
    }

    const handleEditorChange = (content: any, editor: any) => {
        setIsi(content);;
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        const formData = new FormData()
        formData.append('judul', judul)
        formData.append('tanggalPengumuman', new Date(tanggalPengumuman).toISOString())
        formData.append('isi', isi)
        formData.append('divisi', String(divisi))
        console.log('aaaa',String(divisi))

        const xxx = await axios.patch(`/admin/api/pengumuman/${pengumuman.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        reload()
        setIsLoading(false)
        setShow(false);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil Simpan',
            showConfirmButton: false,
            timer: 1500
        })
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
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Edit Data Pengumuman</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Divisi</label>
                            <div className="col-sm-9">
                                <Select
                                    required
                                    isMulti
                                    styles={scroll}
                                    options={daftardivisi}
                                    value={daftardivisi.filter((option: any) => divisi.includes(option.value))}
                                    onChange={handleSelectChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Judul</label>
                            <div className="col-sm-9">
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    value={judul} onChange={(e) => setJudul(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Tanggal</label>
                            <div className="col-sm-9">
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    value={tanggalPengumuman} onChange={(e) => setTanggalPengumuman(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <Editor
                                    value={isi}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | blocks |formatselect | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                    onEditorChange={handleEditorChange}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal >
        </>
    )
}

export default Update