/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { JobdeskTb, KaryawanTb } from "@prisma/client"
import Modal from 'react-bootstrap/Modal';
import moment from "moment"
import { supabaseUrl, supabaseBUCKET } from "@/app/helper";

import { useReactToPrint } from "react-to-print";

function Print({ jobdesk, findkaryawan }: { jobdesk: JobdeskTb, findkaryawan: KaryawanTb }) {

    const [namakaryawan, setNamakaryawan] = useState(findkaryawan.nama)
    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [tanggalMulai, setTanggalMulai] = useState(moment(jobdesk.tanggalMulai).format("DD-MM-YYYY"))
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("DD-MM-YYYY"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [status, setStatus] = useState(jobdesk.status)
    const [alasan, setAlasan] = useState(jobdesk?.alasan)
    const [tanggalkerjaValue, setTanggalkerjaValue] = useState(moment(jobdesk?.tanggalPelaksanaan).format("DD-MM-YYYY"))
    const [fileValue, setFileValue] = useState(jobdesk?.file)
    const [fileSuratTugasValue, setFileSuratTugasValue] = useState('')
    const [fileBeritaAcaraValue, setFileBeritaAcaraValue] = useState('')
    const [fileAnggaranValue, setFileAnggaranValue] = useState('')
    const [namateam, setNamateam] = useState('');
    const [keteranganAkhirValue, setKeteranganAkhirValue] = useState(jobdesk?.keteranganAkhir)
    const [show, setShow] = useState(false);

    const contentRef = useRef(null);

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => {
        setShow(true),
            refreshform()
    }

    const refreshform = () => {
        setFileSuratTugasValue(jobdesk.suratTugas)
        setFileBeritaAcaraValue(jobdesk.beritaAcara)
        setFileAnggaranValue(jobdesk.laporanAnggaran)
        setTanggalkerjaValue(moment(jobdesk?.tanggalPelaksanaan).format("DD-MM-YYYY"))
        setFileValue(jobdesk?.file)
        setStatus(jobdesk.status)
        setKeteranganAkhirValue(jobdesk?.keteranganAkhir)
    }

    useEffect(() => {
        tampilTeam();
    }, [])

    const tampilTeam = async () => {
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const labelArray = dataNamaTeam.map((item: any) => item.label);
        setNamateam(labelArray.join(', '))
    }

    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
    });




    return (
        <>
            <button onClick={handlePrint} type="button" className="btn btn-info"><i className="fa-solid fa-print me-2"></i>Print</button>

            <div className="modal">
                <div ref={contentRef}>
                    <h2 className="text-center">Data Tugas</h2>


                    <div className="card-body">
                        <div className="row">
                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Karyawan </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {namakaryawan}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Team </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {namateam}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Tugas </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {namaJob}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deskripsi </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {keterangan}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Tanggal Mulai </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {tanggalMulai}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deadline </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {deadline}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Status </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "blue" }}>
                                    {status}
                                </div>

                            </div>

                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Tanggal Pelaksanaan </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {tanggalkerjaValue}
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Keterangan Akhir</div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>

                                    <div dangerouslySetInnerHTML={{ __html: keteranganAkhirValue || '' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Print