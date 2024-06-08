"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { supabase, supabaseBUCKET } from '@/app/helper'
import { useRouter } from "next/navigation"

function Add({ reload }: { reload: Function }) {
    const [judul, setJudul] = useState("")
    const [file, setFile] = useState<File | null>()
    const [preview, setPreview] = useState('')
    const [show, setShow] = useState(false);
    const router = useRouter()
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
        setFile(null)
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('judul', judul)
            formData.append('file', file as File)
            const image = formData.get('file') as File;
            const namaunik = Date.now() + '-' + image.name
            formData.append('namaunik', namaunik)

            const uploadResult = await supabase.storage
                .from(supabaseBUCKET)
                .upload(`foto-slide/${namaunik}`, image);

            if (uploadResult.error) {
                setIsLoading(false)
                reload()
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Gagal Upload Gambar',
                    showConfirmButton: false,
                    timer: 1500
                })
                throw uploadResult.error
            }

            const xxx = await axios.post(`/admin/api/slide`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'berhasil') {
                handleClose();
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil Simpan',
                    showConfirmButton: false,
                    timer: 1500
                })
                clearForm();
                reload()
                router.refresh()
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                Tambah Slide</button>
            <Modal
                dialogClassName="modal-m"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data Slide</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-12 d-flex justify-content-center">
                                {file ?
                                    <div className="">
                                        <img
                                            src={preview}
                                            className="rounded"
                                            width='100%'
                                            height={250}
                                            alt=""
                                        />
                                    </div>
                                    :
                                    <img className="bg-gambarfoto" />
                                }
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Foto Slide</label>
                            <div className="col-sm-9">
                                <input
                                    required
                                    type="file"
                                    className="form-control"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => setFile(e.target.files?.[0])}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label" >Judul Slide</label>
                            <div className="col-sm-9">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={judul} onChange={(e) => setJudul(e.target.value)}
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