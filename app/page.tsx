"use client"
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import Swal from 'sweetalert2'
import AvatarEditor from 'react-avatar-editor';
import Modal from 'react-bootstrap/Modal';
import { supabase, supabaseUrl, supabaseBUCKET, tanggalHariIni } from '@/app/helper'

const Profil = () => {
    const [karyawanId, setKaryawanId] = useState('')
    const [namaAvatar, setNamaAvatar] = useState('')
    const [nama, setNama] = useState('')
    const [alamat, setAlamat] = useState("")
    const [tempatLahir, setTempatLahir] = useState("")
    const [tanggalLahir, setTanggalLahir] = useState(tanggalHariIni)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [hp, setHp] = useState("")
    const [namaDivisi, setNamadivisi] = useState("")
    const [fotolama, setFotoLama] = useState("")
    const [preview, setPreview] = useState("")
    const [ktplama, setKtpLama] = useState("")
    const [previewktp, setPreviewktp] = useState("")
    const [cvlama, setCvLama] = useState("")
    const [previewcv, setPreviewcv] = useState("")
    const [ijazahlama, setIjazahLama] = useState("")
    const [previewijazah, setPreviewijazah] = useState("")

    const [file, setFile] = useState<File | null>()
    const [ktp, setKtp] = useState<File | null>()
    const [Cv, setCV] = useState<File | null>()
    const [ijazah, setIjazah] = useState<File | null>()

    const [previewktp2, setPreviewktp2] = useState("")
    const [previewcv2, setPreviewcv2] = useState("")
    const [previewijazah2, setPreviewijazah2] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const editorRef = useRef<AvatarEditor>(null);

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

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        clearForm()
    }

    async function clearForm() {
        const response = await axios.get(`/admin/api/profil`);
        const data = response.data;
        setFile(null)
        setPreview(data?.foto)
    }

    const handleCrop = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImage();
            canvas.toBlob((blob: any) => {
                setFile(blob)
            });
            const canvasScaled = editorRef.current.getImageScaledToCanvas();
            const croppedData = canvasScaled.toDataURL();
            setPreview(croppedData)
            setShow(false)
        }
    };

    let editor: AvatarEditor | null;

    const handleFileChange = (e: any) => {
        const selectedImage = e.target.files[0];
        setFile(selectedImage);
        const objectUrl = URL.createObjectURL(selectedImage)
        setPreview(objectUrl)
        handleShow()
    };

    const handleKTP = (e: any) => {
        const selectedktp = e.target.files[0];
        setKtp(selectedktp);
        const objectUrl = URL.createObjectURL(selectedktp)
        setPreviewktp(objectUrl)
        setPreviewktp2(selectedktp.name)
    }

    const handleCV = (e: any) => {
        const selectedcv = e.target.files[0];
        setCV(selectedcv);
        const objectUrl = URL.createObjectURL(selectedcv)
        setPreviewcv(objectUrl)
        setPreviewcv2(selectedcv.name)
    };

    const handleIjazah = (e: any) => {
        const selectedijazah = e.target.files[0];
        setIjazah(selectedijazah);
        const objectUrl = URL.createObjectURL(selectedijazah)
        setPreviewijazah(objectUrl)
        setPreviewijazah2(selectedijazah.name)
    };

    useEffect(() => {
        fetchDataprofil()
    }, [])

    const fetchDataprofil = async () => {
        try {
            const response = await axios.get(`/admin/api/profil`);
            const result = await response.data;
            setKaryawanId(result.id)
            setNama(result.nama);
            setNamaAvatar(result.nama);
            setTanggalLahir(moment(result.tanggalLahir).format("YYYY-MM-DD"));
            setTempatLahir(result.tempatLahir);
            setAlamat(result.alamat);
            setHp(result.hp);
            setEmail(result.email);
            setFotoLama(result?.foto)
            setPreview(result?.foto)
            setKtpLama(result?.ktp)
            setPreviewktp(result?.ktp)
            setCvLama(result?.CV)
            setPreviewcv(result?.CV)
            setIjazahLama(result?.ijazah)
            setPreviewijazah(result?.ijazah)
            console.log('foto', result.nama)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpdate = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        const newfoto = preview === fotolama ? 'no' : 'yes'
        const newktp = previewktp === ktplama ? 'no' : 'yes'
        const newcv = previewcv === cvlama ? 'no' : 'yes'
        const newijazah = previewijazah === ijazahlama ? 'no' : 'yes'
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('tempatlahir', tempatLahir)
            formData.append('tanggallahir', new Date(tanggalLahir).toISOString())
            formData.append('alamat', alamat)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('newfoto', newfoto)
            formData.append('newktp', newktp)
            formData.append('newcv', newcv)
            formData.append('newijazah', newijazah)
            formData.append('file', file as File)
            formData.append('ktp', ktp as File)
            formData.append('CV', Cv as File)
            formData.append('ijazah', ijazah as File)

            if (newfoto === 'yes') {

                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`foto-profil/${fotolama}`]);

                const foto = formData.get('file') as File;
                const namaunik = nama + '-' + Date.now() + '-' + foto.name

                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`foto-profil/${namaunik}`, foto);

                formData.append('namaunik', namaunik)
                setFotoLama(namaunik)
            }

            if (newktp === 'yes') {

                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`foto-profil/${ktplama}`]);

                const ktpbaru = formData.get('ktp') as File;
                const namaunikktp = nama + '-' + Date.now() + '-' + ktpbaru.name

                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`foto-profil/${namaunikktp}`, ktpbaru);

                formData.append('namaunikktp', namaunikktp)
                setKtpLama(namaunikktp)
            }

            if (newcv === 'yes') {

                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`foto-profil/${cvlama}`]);

                const cvbaru = formData.get('CV') as File;
                const namaunikcv = nama + '-' + Date.now() + '-' + cvbaru.name

                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`foto-profil/${namaunikcv}`, cvbaru);

                formData.append('namaunikcv', namaunikcv)
                setCvLama(namaunikcv)
            }

            if (newijazah === 'yes') {

                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`foto-profil/${ijazahlama}`]);

                const ijazahbaru = formData.get('ijazah') as File;
                const namaunikijazah = nama + '-' + Date.now() + '-' + ijazahbaru.name

                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`foto-profil/${namaunikijazah}`, ijazahbaru);

                formData.append('namaunikijazah', namaunikijazah)
                setIjazahLama(namaunikijazah)
            }

            const xxx = await axios.patch(`/admin/api/profil/${karyawanId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            setTimeout(function () {

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
                    hapuspass()
                    setIsLoading(false)
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil diubah',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const hapuspass = () => {
        setPassword('')
    }

    return (
        <div className="row">
            <div className="col-xl-3 col-lg-4">
                <div className="clearfix">
                    <div className="card card-bx profile-card author-profile m-b30">
                        <div className="card-body">
                            <div className="p-5">
                                <div className="author-profile">
                                    <div className="author-media">
                                        {file ? <img src={preview} width={200} className="mb-3 " alt="Responsive image" /> : <img src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${preview}`} alt={""} className="mb-3 " width={200} height={200} />}
                                        <div
                                            className="upload-link"
                                            title=""
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            data-original-title="update"
                                        >
                                            <input type="file" className="update-flie" accept="image/png, image/jpeg" onChange={handleFileChange} />
                                            <i className="fa fa-camera" />
                                        </div>
                                    </div>


                                    <div className="author-info">
                                        <h6 className="title">{namaAvatar}</h6>
                                        <span>{namaDivisi}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-list">
                                <ul>
                                    <li >
                                        <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${ktplama}`} target="_blank" >Scan KTP</a>
                                        <div className='col-30'>
                                            <label htmlFor="ktp" className="btn btn-primary">
                                                <span>
                                                    <input
                                                        type="file"
                                                        id="ktp"
                                                        hidden
                                                        onChange={handleKTP}
                                                    />
                                                </span>
                                                Upload
                                            </label>
                                            {/* {previewktp2 !== '' ?
                                                <div >{previewktp2}</div>
                                                :
                                                null
                                            } */}
                                        </div>
                                    </li>
                                    <li>
                                        <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${cvlama}`} target="_blank" >Resume CV</a>
                                        <div className='col-30'>
                                            <label htmlFor="cv" className="btn btn-primary">
                                                <span>
                                                    <input
                                                        type="file"
                                                        id="cv"
                                                        hidden
                                                        onChange={handleCV}
                                                    />
                                                </span>
                                                Upload
                                            </label>
                                            {/* {previewcv2 !== '' ?
                                                <div >{previewcv2}</div>
                                                :
                                                null
                                            } */}
                                        </div>
                                    </li>
                                    <li>
                                        <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${ijazahlama}`} target="_blank" >Scan Ijazah</a>
                                        <div className='col-30'>
                                            <label htmlFor="ijazah" className="btn btn-primary">
                                                <span>
                                                    <input
                                                        type="file"
                                                        id="ijazah"
                                                        hidden
                                                        onChange={handleIjazah}
                                                    />
                                                </span>
                                                Upload
                                            </label>
                                            {/* {previewijazah2 !== '' ?
                                                <div >{previewijazah2}</div>
                                                :
                                                null
                                            } */}
                                        </div>
                                    </li>

                                </ul>
                            </div>
                        </div>
                        <div className="card-footer">
                            {/* <div className="input-group mb-3">
                                <div className="form-control rounded text-center bg-white">
                                    Portfolio
                                </div>
                            </div> */}
                            <button type='button' className="btn btn-primary light light" onClick={handleUpdate}>UPDATE DATA</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-9 col-lg-8">
                <div className="card profile-card card-bx m-b30">
                    <div className="card-header">
                        <h6 className="card-title">Profil Karyawan</h6>
                    </div>
                    <form className="profile-form" onSubmit={handleUpdate}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12 m-b30">
                                    <label className="form-label">Nama</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={nama} onChange={(e) => setNama(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">Tempat Lahir</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">Tanggal Lahir</label>
                                    <input
                                        required
                                        type="date"
                                        className="form-control"
                                        value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-12 m-b30">
                                    <label className="form-label">Alamat</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="form-control"
                                        value={alamat} onChange={(e) => setAlamat(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">No Hp</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={hp} onChange={(e) => setHp(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">Email</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>


                            </div>
                            {/* <div className="card-footer">
                                <button type='submit' className="btn btn-primary light light">UPDATE</button>
                            </div> */}
                        </div>
                    </form>
                </div>
            </div>

            <Modal
                dialogClassName="modal-s"
                show={show}
                onHide={handleClose}
                backdrop="static"

                keyboard={false}>


                <Modal.Header closeButton>
                    {/* <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Tambah Data Divisi</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    {file && (
                        <div>
                            <div>
                                <AvatarEditor
                                     ref={editorRef}
                                    image={file}
                                    width={200}
                                    height={200}
                                    border={50}
                                    color={[255, 255, 255, 0.6]}
                                />
                            </div>
                            <span onClick={handleCrop} className="btn btn-primary shadow btn-xl sharp mt-0">Selesai <i className="fa fa-check"> </i></span>
                        </div>
                    )}

                </Modal.Body>


            </Modal>
        </div>

    )
}

export default Profil