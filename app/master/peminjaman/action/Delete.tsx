"use client"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";


function Delete({ peminjamanId, reload }: { peminjamanId: Number, reload: Function }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const router = useRouter()
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

    const handleDelete = async (peminjamanId: number) => {
        setIsLoading(true)
        handleClose()
        await axios.delete(`/master/api/peminjaman/${peminjamanId}`)
        setTimeout(function () {
            setIsLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Berhasil dihapus',
                showConfirmButton: false,
                timer: 1500
            })
            reload()
            setTimeout(function () {
                router.refresh()
            }, 1500);
        }, 1500);
    }

    return (
        <>
            <span onClick={handleShow} className="btn btn-danger shadow btn-xl sharp mx-1"><i className="fa fa-trash"></i></span>
            <Modal
                dialogClassName="modal-md"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Body>
                    <h6 className="font-bold" style={{ color: "black" }}>Anda jakin menghapus data ini ?</h6>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-warning light" onClick={handleClose}>Close</button>
                    <button type="button" className="btn btn-danger light" onClick={() => handleDelete(Number(peminjamanId))}>Ya, Hapus</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Delete