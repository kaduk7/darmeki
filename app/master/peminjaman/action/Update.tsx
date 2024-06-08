/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import { Inventaris } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"

function Update({ barang, reload }: { barang: Inventaris, reload: Function }) {
    const [kodeBarang, setKodeBarang] = useState(barang.kodeBarang)
    const [nama, setNama] = useState(barang.nama)
    const [merek, setMerek] = useState(barang.merek)
    const [stok, setStok] = useState(String(barang.stok))


    const [show, setShow] = useState(false)
    const router = useRouter()

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => {
        setShow(true);
    }

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

    }, [])

    const refreshform = () => {
        setKodeBarang(barang.kodeBarang)
        setNama(barang.nama)
        setMerek(barang.merek)
        setStok(String(barang.stok))
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('merek', merek)
            formData.append('stok', stok)


            const xxx = await axios.patch(`/master/api/inventaris/${barang.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            setTimeout(function () {
                if (xxx.data.pesan == 'berhasil') {
                    setShow(false);
                    setIsLoading(false)
                    reload()
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
                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <>
            <span onClick={handleShow} className="btn btn-success shadow btn-xl sharp mx-1"><i className="fa fa-edit"></i></span>
            <Modal
                dialogClassName="modal-m"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Data Barang</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black" }}>Kode Barang</label>
                                <input
                                    disabled
                                    required
                                    type="text"
                                    className="form-control"
                                    value={kodeBarang} onChange={(e) => setKodeBarang(e.target.value)}
                                />
                            </div>

                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label"style={{ color: "black" }}>Nama Barang</label>
                                <input
                                    autoFocus
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
        </>
    )
}

export default Update