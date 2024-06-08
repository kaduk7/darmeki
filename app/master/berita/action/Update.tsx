/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { BeritaTb, JobdeskTb, KaryawanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { Editor } from '@tinymce/tinymce-react';
import Image from "next/image"
import { supabase, supabaseBUCKET, supabaseUrl } from "@/app/helper"

function Update({ berita,reload }: { berita: BeritaTb,reload:Function }) {

    const [karyawanId, setKaryawanId] = useState(String(berita.karyawanId))
    const [judul, setJudul] = useState(berita.judul)
    const [isi, setIsi] = useState(berita.isi)
    const [tanggalBerita, setTanggalberita] = useState(moment(berita.tanggalBerita).format("YYYY-MM-DD"))
    const [file, setFile] = useState<File | null>()
    const [preview, setPreview] = useState(berita?.foto)
    const [fotolama, setFotolama] = useState(berita?.foto)
    const [preview2, setPreview2] = useState('')

    const router = useRouter()
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        if (!file) {
            setPreview2('')
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setPreview2(objectUrl)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [file])


    const refreshform = () => {
        setKaryawanId(String(berita.karyawanId))
        setJudul(berita.judul)
        setIsi(berita.isi)
        setTanggalberita(moment(berita.tanggalBerita).format("YYYY-MM-DD"))
        setPreview(berita?.foto)
        setFotolama(berita?.foto)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        Swal.fire({
            title: "Mohon tunggu!",
            html: "Sedang validasi data",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },

        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
            }
        });

        e.preventDefault()
        const newfoto = preview === fotolama ? 'no' : 'yes'
        try {
            const formData = new FormData()
            formData.append('judul', judul)
            formData.append('isi', isi)
            formData.append('tanggalBerita', new Date(tanggalBerita).toISOString())
            formData.append('karyawanId', karyawanId)
            formData.append('newfoto', newfoto)
            formData.append('file', file as File)

            if (newfoto === 'yes') {

                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`berita-images/${berita.foto}`]);

                const image = formData.get('file') as File;
                const namaunik = Date.now() + '-' + image.name

                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`berita-images/${namaunik}`, image);

                formData.append('namaunik', namaunik)
            }

            const xxx = await axios.patch(`/admin/api/berita/${berita.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setTimeout(function () {
                if (xxx.data.pesan == 'berhasil') {
                    setShow(false);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil diubah',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(function () {
                        router.refresh()
                    }, 1500);
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
        <>
            <a onClick={handleShow} className="dropdown-item">Edit Berita</a>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Edit Berita</Modal.Title>
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
                                {file ? <img src={preview2} width={200} className="mb-3 " alt="Responsive image" /> : <img src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/berita-images/${preview}`} alt={""} className="mb-3 " width={200} height={150} />}
                            </div>


                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Isi</label>
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
            </Modal>
        </>
    )
}

export default Update