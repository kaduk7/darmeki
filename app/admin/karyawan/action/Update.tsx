/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import { HakAksesTb, KaryawanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { useSession } from "next-auth/react"

function Update({ karyawan, hakAkses, reload }: { karyawan: KaryawanTb, hakAkses: HakAksesTb, reload: Function }) {
    const session = useSession()
    const [nama, setNama] = useState(karyawan.nama)
    const [tempatLahir, setTempatlahir] = useState(karyawan?.tempatLahir || "")
    const [tanggalLahir, setTanggallahir] = useState(moment(karyawan?.tanggalLahir).format("YYYY-MM-DD"))
    const [alamat, setAlamat] = useState(karyawan?.alamat || "")
    const [hp, setHp] = useState(karyawan.hp)
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState(karyawan.email)
    const [divisi, setDivisi] = useState(karyawan.divisi)

    const [karyawanCek, setKaryawanCek] = useState(false)
    const [informasiCek, setInformasiCek] = useState(false)
    const [jobdeskCek, setJobdeskCek] = useState(false)
    const [karyawanCekValue, setKaryawanCekValue] = useState(hakAkses.datakaryawan)
    const [informasiCekValue, setInformasiCekValue] = useState(hakAkses.informasi)
    const [jobdeskCekValue, setJobdeskCekValue] = useState(hakAkses.jobdesk)
    const [st, setSt] = useState(false);
    const [show, setShow] = useState(false)
    const router = useRouter()

    const handleClose = () => {
        setShow(false);
        refreshform()
        hakAksesceklis()
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
        hakAksesceklis()
    }, [])

    const hakAksesceklis = () => {
        if (hakAkses.datakaryawan === "Ya") {
            setKaryawanCek(true)
        }

        if (hakAkses.informasi === "Ya") {
            setInformasiCek(true)
        }
        if (hakAkses.jobdesk === "Ya") {
            setJobdeskCek(true)
        }
    }

    const refreshform = () => {
        setNama(karyawan.nama)
        setTempatlahir(karyawan?.tempatLahir || '')
        setTanggallahir(moment(karyawan?.tanggalLahir).format("YYYY-MM-DD"))
        setAlamat(karyawan?.alamat || '')
        setHp(karyawan.hp)
        setEmail(karyawan.email)
        setDivisi(karyawan.divisi)
        setPassword('')
    }

    const hapuspass = () => {
        setPassword('')
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        const newpass = password == "" ? 'no' : 'yes'
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('tempatlahir', tempatLahir)
            formData.append('tanggallahir', new Date(tanggalLahir).toISOString())
            formData.append('alamat', alamat)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('newpass', newpass)
            formData.append('divisi', divisi)
            formData.append('karyawanCekValue', karyawanCekValue)
            formData.append('informasiCekValue', informasiCekValue)
            formData.append('jobdeskCekValue', jobdeskCekValue)

            const xxx = await axios.patch(`/admin/api/karyawan/${karyawan.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'sudah ada email') {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Email ini sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

            if (xxx.data.pesan == 'sudah ada hp') {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'No Hp ini sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })

            }
            if (xxx.data.pesan == 'berhasil') {
                setShow(false);
                setIsLoading(false)
                hapuspass()
                reload()
                router.refresh()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil diubah',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleCheckboxChangeKaryawan = () => {
        setKaryawanCek(!karyawanCek);
        if (!karyawanCek) {
            setKaryawanCekValue("Ya")
        }
        else {
            setKaryawanCekValue("Tidak")
        }
    };

    const handleCheckboxChangeinformasi = () => {
        setInformasiCek(!informasiCek);
        if (!informasiCek) {
            setInformasiCekValue("Ya")
        }
        else {
            setInformasiCekValue("Tidak")
        }
    };

    const handleCheckboxChangeJobdesk = () => {
        setJobdeskCek(!jobdeskCek);
        if (!jobdeskCek) {
            setJobdeskCekValue("Ya")
        }
        else {
            setJobdeskCekValue("Tidak")
        }
    };

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
                        <Modal.Title style={{ color: "black" }}>Edit Data Karyawan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black", borderColor: "grey" }}>Nama Karyawan</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>No Hp</label>
                                <input
                                    required
                                    type="number"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={hp} onChange={(e) => setHp(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Divisi</label>
                                <select
                                    required
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    className="form-control"
                                    value={divisi} onChange={(e) => setDivisi(e.target.value)}>
                                    <option value={''}> Pilih Divisi</option>
                                    <option value={'Admin'}>Admin</option>
                                    <option value={'Marketing'}>Marketing</option>
                                    <option value={'PIC'}>PIC</option>
                                    <option value={'Logistik'}>Logistik</option>
                                    <option value={'Teknisi'}>Teknisi</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Email</label>
                                <input
                                    required
                                    type="email"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Password</label>
                                <div className="input-group input-success">
                                    <input
                                        type={st ? "text" : "password"}
                                        className="form-control"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {st ?
                                        <button onClick={() => setSt(!st)} className="input-group-text border-0" type="button">
                                            <i className="mdi mdi-eye-off" />
                                        </button>
                                        :
                                        <button onClick={() => setSt(!st)} className="input-group-text border-0" type="button">
                                            <i className="mdi mdi-eye" />
                                        </button>
                                    }
                                </div>
                            </div>

                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Tempat Lahir</label>
                                <input
                                    // required
                                    type="text"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={tempatLahir} onChange={(e) => setTempatlahir(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ color: "black" }}>Tanggal Lahir</label>
                                <input
                                    // required
                                    type="date"
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={tanggalLahir} onChange={(e) => setTanggallahir(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row  mb-3">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ color: "black" }}>Alamat</label>
                                <textarea
                                    // required
                                    className="form-control"
                                    style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                                    value={alamat} onChange={(e) => setAlamat(e.target.value)}
                                />
                            </div>
                        </div>

                        {session?.data?.status === 'Admin' ?
                            <div className="row">
                                <div className=" col-md-12">
                                    <label className="form-label" style={{ color: "black" }}>Hak Akses</label>
                                    <div className="row">
                                        <div className="col-xl-4 col-xxl-4 col-4">
                                            <div className="form-check custom-checkbox mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    style={{ color: "black", borderColor: "grey" }}
                                                    id="karyawancek"
                                                    checked={karyawanCek}
                                                    onChange={handleCheckboxChangeKaryawan}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="karyawancek"
                                                    style={{ color: "black" }}>
                                                    Data Karyawan
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-xxl-4 col-4">
                                            <div className="form-check custom-checkbox mb-3 ">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    style={{ color: "black", borderColor: "grey" }}
                                                    id="informasicek"
                                                    checked={informasiCek}
                                                    onChange={handleCheckboxChangeinformasi}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="informasicek"
                                                    style={{ color: "black" }}>
                                                    Informasi
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-xxl-4 col-4">
                                            <div className="form-check custom-checkbox mb-3 ">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    style={{ color: "black", borderColor: "grey" }}
                                                    id="jobdeskcek"
                                                    checked={jobdeskCek}
                                                    onChange={handleCheckboxChangeJobdesk}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="jobdeskcek"
                                                    style={{ color: "black" }}>
                                                    Jobdesk
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
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