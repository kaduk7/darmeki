"use client"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"
import DataTable from 'react-data-table-component';

function Add({ reload, reloadId, ulId, dataAll }: { reload: Function, reloadId: Function, ulId: String, dataAll: Array<any> }) {
    const [datakaryawan, setDatakaryawan] = useState([])
    const ulid = ulId
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
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

    const tombol = (row: any) => {
        Swal.fire({
            title: "Anda Yakin..?",
            text: "Pindahkan Karyawan ke UL ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Lanjutkan!"
        }).then((result) => {
            if (result.isConfirmed) {
                handleEdit(row)
            }
        });
    }

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        ref.current?.focus();
        daftarkaryawan()
        
    }, [])

    const daftarkaryawan = async () => {
        try {
            const response = await fetch(`/admin/api/karyawan`);
            const result = await response.json();
            setDatakaryawan(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function clearForm() {

    }
    const handleRowsPerPageChange = (newPerPage: number, page: number) => {
        setItemsPerPage(newPerPage);
        setCurrentPage(page);
    };

    const filteredItems = datakaryawan.filter(
        (item: any) => item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase()),
    );

    const columns = [
        {
            name: 'No',
            cell: (row: any, index: number) => <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>,
            sortable: false,
            width: '80px'
        },
        {
            name: 'Nama',
            selector: (row: any) => row.nama,
            sortable: true,
        },
        {
            name: 'No Hp',
            selector: (row: any) => row.hp,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row: any) => (


                dataAll.some((data: any) => data.karyawanId === Number(row.id) && data.ulId === Number(ulid))
                    ?
                    null
                    :
                    dataAll.some((data: any) => data.karyawanId === Number(row.id))
                        ?

                        (
                            <div className="d-flex">
                                <button type="button" className="btn btn-danger " style={{ width: '100px' }} onClick={() => tombol(row)}>Pindah</button>
                            </div>
                        )
                        :
                        (
                            <div className="d-flex">
                                <button type="button" className="btn btn-success " style={{ width: '100px' }} onClick={() => handleSubmit(row)}>Tambah</button>
                            </div>
                        )
            ),
            width: '150px'
        },
    ];

    const handleSubmit = async (row: any) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('karyawanid', row.id)
            formData.append('ulid', String(ulid))

            const xxx = await axios.post(`/admin/api/areakerja`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (xxx.data.pesan == 'berhasil') {
                setIsLoading(false)
                clearForm();
                reload()
                reloadId(ulid)
                router.refresh()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil Simpan',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleEdit = async (row: any) => {
        setIsLoading(true)
        const found = dataAll.find(
            (data) =>
                data.karyawanId === Number(row.id)
        );
        const ambilid=found.id
        try {
            const formData = new FormData()
            formData.append('karyawanid', row.id)
            formData.append('ulid', String(ulid))

            const xxx = await axios.patch(`/admin/api/areakerja/${ambilid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (xxx.data.pesan == 'berhasil') {
                setIsLoading(false)
                clearForm();
                reload()
                reloadId(ulid)
                router.refresh()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil Dipindahkan',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                Tambah User</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row mb-3">
                            <div className="col-md-9">

                            </div>
                            <div className="col-md-3">
                                <div className="input-group mb-3  input-success">
                                    <span className="input-group-text border-0"><i className="mdi mdi-magnify"></i></span>
                                    <input
                                        id="search"
                                        type="text"
                                        placeholder="Search..."
                                        aria-label="Search Input"
                                        value={filterText}
                                        onChange={(e: any) => setFilterText(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                        <DataTable
                            columns={columns}
                            data={filteredItems}
                            pagination
                            persistTableHead
                            responsive
                            paginationPerPage={itemsPerPage}
                            paginationTotalRows={filteredItems.length}
                            onChangePage={(page) => setCurrentPage(page)}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            paginationRowsPerPageOptions={[5, 10, 20]}
                            customStyles={{
                                headRow: {
                                    style: {
                                        backgroundColor: '#53d0b2',
                                    },
                                },
                            }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default Add