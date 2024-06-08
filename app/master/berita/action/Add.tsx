/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { Editor } from '@tinymce/tinymce-react';
import { supabase, supabaseUrl, supabaseBUCKET, tanggalHariIni } from '@/app/helper'

function Add({ idkaryawan, reload }: { idkaryawan: Number, reload: Function }) {
    const [karyawanId, setKaryawanId] = useState('')
    const [judul, setJudul] = useState("")
    const [isi, setIsi] = useState("")
    const [tanggalBerita, setTanggalberita] = useState(tanggalHariIni)
    const [file, setFile] = useState<File | null>()
    const [preview, setPreview] = useState("")

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

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    useEffect(() => {
        ref.current?.focus();
        setKaryawanId(String(idkaryawan))
    }, [idkaryawan, karyawanId])

    useEffect(() => {
        if (!file) {
            setPreview('')
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)

    }, [file])

    function clearForm() {
        setJudul('')
        setIsi('')
        setTanggalberita(tanggalHariIni)
        setFile(null)
        setPreview('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('judul', judul)
            formData.append('isi', isi)
            formData.append('tanggalBerita', new Date(tanggalBerita).toISOString())
            formData.append('karyawanId', karyawanId)
            formData.append('file', file as File)

            const image = formData.get('file') as File;
            const namaunik = Date.now() + '-' + image.name

            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`berita-images/${namaunik}`, image);

            formData.append('namaunik', namaunik)

            const xxx = await axios.post(`/admin/api/berita`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setTimeout(function () {

                if (xxx.data.pesan == 'berhasil') {
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
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleEditorChange = (content: any, editor: any) => {
        setIsi(content);;
    }


    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text mb-3 mt-3">
                <i className=""></i>Buat Berita</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Post Berita</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Judul Berita</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={judul} onChange={(e) => setJudul(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Tanggal Berita</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tanggalBerita} onChange={(e) => setTanggalberita(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label mx-1" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Upload Foto</label>
                                <input type="file" className="form-control" accept="image/png, image/jpeg" onChange={(e) => setFile(e.target.files?.[0])} />
                            </div>

                            <div className="mb-3 col-md-6">
                                {file ? <img src={preview} width={200} className="mb-3 " alt="Responsive image" /> : null}
                            </div>


                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Isi</label>
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
                                            'removeformat | help |image',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                        images_upload_url: '/upload',
                                        images_upload_base_path: '/images',
                                        images_upload_credentials: true,
                                        file_picker_types: 'image',
                                        file_picker_callback: (cb, value, meta) => {

                                        },
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