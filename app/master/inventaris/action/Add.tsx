/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";

function Add({ reload }: { reload: Function }) {
    const [kodeBarang, setKodeBarang] = useState("")
    const [nama, setNama] = useState("")
    const [merek, setMerek] = useState("")
    const [stok, setStok] = useState("")

    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const router = useRouter()

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    const handleShow = () => setShow(true);
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

    useEffect(() => {
        ref.current?.focus();
    }, [])

    function clearForm() {
        setKodeBarang('')
        setNama('')
        setMerek('')
        setStok('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {

        setIsLoading(true)
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('kodeBarang', kodeBarang)
            formData.append('nama', nama)
            formData.append('merek', merek)
            formData.append('stok', stok)

            const xxx = await axios.post(`/master/api/inventaris`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (xxx.data.pesan === 'kode barang sudah ada') {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Data barang sudah ada',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
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
                <i className=""></i>Tambah Barang</button>
            <Modal
                dialogClassName="modal-m"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data Barang</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black" }}>Kode Barang</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    value={kodeBarang} onChange={(e) => setKodeBarang(e.target.value)}
                                />
                            </div>

                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black" }}>Nama Barang</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black" }}>Merek</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    value={merek} onChange={(e) => setMerek(e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black" }}>Stok</label>
                                <input
                                    required
                                    type="number"
                                    className="form-control"
                                    value={stok} onChange={(e) => setStok(e.target.value)}
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