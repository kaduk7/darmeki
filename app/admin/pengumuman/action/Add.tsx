/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { Editor } from '@tinymce/tinymce-react';
import Select from 'react-select';
import { scroll, tanggalHariIni } from "@/app/helper";


function Add({ reload, daftardivisi }: { reload: Function, daftardivisi: Array<any> }) {
    const [judul, setJudul] = useState("")
    const [tanggalPengumuman, setTanggalPengumuman] = useState(tanggalHariIni)
    const [isi, setIsi] = useState("")
    const [divisi, setDivisi] = useState<string[]>([]);
    const [selectdivisiId, setSelectDivisiId] = useState<string[]>([]);

    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
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
        clearForm();
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        ref.current?.focus();

    }, [])

    const handleSelectChange = (selectedOptions: any) => {
        setDivisi(selectedOptions.map((option: any) => option.value));
        setSelectDivisiId(selectedOptions)
    };

    const handleEditorChange = (content: any, editor: any) => {
        setIsi(content);;
    }

    function clearForm() {
        setJudul('')
        setTanggalPengumuman(tanggalHariIni)
        setDivisi([])
        setIsi('')
        setSelectDivisiId([])
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()

        const formData = new FormData()
        formData.append('judul', judul)
        formData.append('tanggalPengumuman', new Date(tanggalPengumuman).toISOString())
        formData.append('isi', isi)
        formData.append('selected', JSON.stringify(selectdivisiId))
        formData.append('divisi', String(divisi))

        const xxx = await axios.post(`/admin/api/pengumuman`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        handleClose();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil Simpan',
            showConfirmButton: false,
            timer: 1500
        })
        clearForm();
        setIsLoading(false)
        reload()
    }


    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                <i className=""></i>Buat Pengumuman</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Buat Pengumuman</Modal.Title>
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
                                    initialValue=""
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
            </Modal>
        </div>
    )
}

export default Add