"use client"
import {  useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { supabase, supabaseUrl, supabaseBUCKET } from '@/app/helper'

function Delete({ beritaId, beritafoto,reload }: { beritaId: Number, beritafoto: String,reload:Function }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const router = useRouter()

    const handleDelete = async (beritaId: number) => {
        handleClose()

        await supabase.storage
        .from(supabaseBUCKET)
        .remove([`berita-images/${beritafoto}`]);

        await axios.delete(`/admin/api/berita/${beritaId}`)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil dihapus',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(function () {
            router.refresh()
            reload()
        }, 1500);
    }

    return (
        <>
            <a onClick={handleShow} className="dropdown-item">Hapus Berita</a>
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
                    <button type="button" className="btn btn-danger light" onClick={() => handleDelete(Number(beritaId))}>Ya, Hapus</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Delete