/* eslint-disable @next/next/no-img-element */
"use client"
import axios from "axios";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Minus } from 'react-feather';
import Swal from "sweetalert2";
import AsyncSelect from 'react-select/async';
import { Button as Button1 } from 'antd';
import { Col, Row } from "@themesberg/react-bootstrap";
import { StyleSelect, tanggalHariIni } from "@/app/helper";
import { useSession } from "next-auth/react";
import Modal from 'react-bootstrap/Modal';

function Add({ reload, datakaryawan, databarang }: { reload: Function, datakaryawan: Array<any>, databarang: Array<any> }) {

    const session = useSession()
    const admin = session.data?.nama
    const [selected, setSelected] = useState(null)
    const [inputFields, setInputFields] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [tanggal, setTanggal] = useState(tanggalHariIni);
    const [totalqty, setTotalqty] = useState(0);
    const ref = useRef<HTMLInputElement>(null);
    const [karyawanId, setKaryawanId] = useState('')
    const refqty = useRef<HTMLInputElement>(null);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        refresh();
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

    let loadOptions = (inputValue: any, callback: any) => {
        setTimeout(async () => {
            if (inputValue.length < 2) {
                callback([]);
                return;
            }
            const data = databarang.filter(
                (item: any) => item.nama && item.nama.toLowerCase().includes(inputValue.toLowerCase()),
            );
            const options = data.map((item: any) => ({
                value: item.id,
                label: item.nama,
                kodeBarang: item.kodeBarang,
                nama: item.nama,
                merek: item.merek,
                stok: item.stok,
            }));
            callback(options);
        }, 300);
    };

    useEffect(() => {
        ref.current?.focus();
    }, [])

    const refresh = () => {
        setInputFields([])
        setSelected(null)
        setTanggal(tanggalHariIni)
        setTotalqty(0)
        setKaryawanId('')
        ref.current?.focus()
    }

    const onKaryawan = (e: any) => {
        setKaryawanId(e.target.value);
    }

    const handlechange = (selected: any) => {
        setSelected(selected)
        const a = inputFields.findIndex((element: any) => element.kodeBarang == selected.kodeBarang);
        let x = []
        if (a > -1) {
            const data: any = [...inputFields]
            data[a].qty++
            data[a].stokakhir = selected.stok - data[a].qty
            setInputFields(data);
            ref.current?.focus();
            x = data
        } else {
            const data: any = [...inputFields, {
                id: selected.value,
                kodeBarang: selected.kodeBarang,
                nama: selected.nama,
                merek: selected.merek,
                stok: selected.stok,
                qty: 1,
                stokakhir: selected.stok - 1
            }]
            setInputFields(data)
            x = data
        }
        let totalqty = 0;
        x.forEach((item: any) => {
            totalqty += Number(item.qty);
        })
        setTotalqty(totalqty)
        setSelected(null)
        ref.current?.focus();
    }

    const handleRemoveFields = (kodeBarang: any) => {
        let x = []
        const values = [...inputFields];
        values.splice(values.findIndex((value: any) => value.kodeBarang === kodeBarang), 1);
        setInputFields(values);
        x = values
        let totalqty = 0;
        x.forEach((item: any) => {
            totalqty += Number(item.qty);
        })
        setTotalqty(totalqty)
        ref.current?.focus();
    }

    const handleChangeInput = (kodeBarang: any, event: any) => {
        let z = []
        const newInputFields: any = inputFields.map((i: any) => {
            if (kodeBarang === i.kodeBarang) {
                let xxx = event.target.value
                if (parseInt(xxx) <= 0) {
                    xxx = '';
                }
                i[event.target.name] = xxx
                i.stokakhir = i.stok - Number(i.qty)
            }
            return i;
        })
        setInputFields(newInputFields);
        z = newInputFields
        let totalbayar = 0;
        let totalqty = 0;
        z.forEach((item: any) => {
            totalbayar += item.subtotal;
            totalqty += Number(item.qty);
        })
        setTotalqty(totalqty)
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        if (karyawanId === '') {
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Pilih Karyawan',
                showConfirmButton: false,
                timer: 2000
            })
            ref.current?.focus();
            return;
        }
        setIsLoading(true)
        e.preventDefault();
        if (totalqty === 0) {
            setIsLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Belum Ada Data',
                showConfirmButton: false,
                timer: 2000
            })
            ref.current?.focus();
            return;
        }
        const cekstok = inputFields.some((item: any) => item.qty > item.stok);
        if (cekstok) {
            setIsLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Stok Tidak Cukup',
                showConfirmButton: false,
                timer: 2000
            })
            return;
        }

        const formData = new FormData()
        formData.append('tanggal', new Date(tanggal).toISOString())
        formData.append('totalItem', String(totalqty))
        formData.append('karyawanId', karyawanId)
        formData.append('selected', JSON.stringify(inputFields))

        await axios.post(`/master/api/peminjaman`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        handleClose();
        reload()
        setIsLoading(false)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil simpan',
            showConfirmButton: false,
            timer: 1500
        })
    };

    const scanbarcode = async (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (barcode == "") {
                return handleSubmit(e)
            }
            const xxx: any = databarang.find((item: any) => item.kodeBarang.toLowerCase() === (barcode.toLowerCase()))
            if (xxx === undefined) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Data Barang Tidak Ada',
                    showConfirmButton: false,
                    timer: 1500
                })
                setBarcode("")
                return
            } else {
                const a = inputFields.findIndex((element: any) => element.kodeBarang == xxx.kodeBarang);
                let x = []
                if (a > -1) {
                    const data: any = [...inputFields]
                    data[a].qty++
                    data[a].stokakhir = xxx.stok - data[a].qty
                    setInputFields(data);
                    x = data
                } else {
                    const data: any = [...inputFields, {
                        id: xxx.id,
                        kodeBarang: xxx.kodeBarang,
                        nama: xxx.nama,
                        merek: xxx.merek,
                        stok: xxx.stok,
                        qty: 1,
                        stokakhir: xxx.stok - 1
                    }]
                    setInputFields(data)
                    x = data
                }
                let totalqty = 0;
                x.forEach((item: any) => {
                    totalqty += Number(item.qty);
                })
                setTotalqty(totalqty)
                setBarcode("")
            }
        }
    }

    const selectallqty = (kodeBarang: any, event: any) => {
        inputFields.map((i: any) => {
            if (kodeBarang === i.kodeBarang) {
                i[event.target.select(refqty.current?.select())] = event.target.value
            }
            return i;
        })
    }

    const qtykey = async (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.target.value <= 0) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Qty tidak boleh 0',
                    showConfirmButton: true,
                })
                return
            }
            return ref.current?.focus()
        }
    }
    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                <i className=""></i>Tambah</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Peminjaman</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label" style={{ fontSize: 13, color: "black" }}>Tanggal</label>
                                <div className="col-sm-3">
                                    <input
                                        required
                                        type="date"
                                        className="form-control"
                                        style={{ fontSize: 13, color: "black", borderColor: "grey" }}
                                        value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                                    />
                                </div>

                                <div className="col-sm-2"></div>

                                <label className="col-sm-2 col-form-label" style={{ fontSize: 13, color: "black" }}>Nama Karyawan</label>
                                <div className="col-sm-3">
                                    <select
                                        required
                                        className="form-control"
                                        value={karyawanId} onChange={onKaryawan}>
                                        <option value={''}> Pilih Karyawan</option>
                                        {datakaryawan?.map((item: any, i) => (
                                            <option key={i} value={item.id} >{item.nama}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label" style={{ fontSize: 13, color: "black" }}>Scan Barcode</label>
                                <div className="col-sm-3">
                                    <div className="input-group mb-3  input-success">
                                        <input type="text"
                                            autoFocus
                                            ref={ref}
                                            style={{ fontSize: 13, color: "black", borderColor: "grey" }}
                                            className="form-control" placeholder="Scan Barcode" aria-label="Username" aria-describedby="basic-addon1"
                                            value={barcode} onChange={(e) => setBarcode(e.target.value)}
                                            onKeyPress={scanbarcode}
                                        />
                                        <span className="input-group-text border-0"><i className="mdi mdi-barcode-scan"></i></span>

                                    </div>
                                </div>

                                <div className="col-sm-2"></div>

                                <label className="col-sm-2 col-form-label" style={{ fontSize: 13, color: "black" }}>Nama Barang</label>
                                <div className="col-sm-3">
                                    <AsyncSelect
                                        cacheOptions
                                        defaultOptions
                                        placeholder="Search..."
                                        loadOptions={loadOptions}
                                        onChange={handlechange}
                                        value={selected}
                                        styles={StyleSelect}
                                    />
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="">
                                        <tr className="table-header">
                                            <th className="" style={{ fontSize: 15, color: "black" }}>Kode barang</th>
                                            <th className="" style={{ fontSize: 15, color: "black" }}>Nama barang</th>
                                            <th className="" style={{ fontSize: 15, color: "black" }}>Merek</th>
                                            <th className="" style={{ fontSize: 15, color: "black" }}>Qty</th>
                                            <th className="" style={{ fontSize: 15, color: "black" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inputFields.map((inputField: any) => (
                                            <tr key={inputField.kodeBarang}>
                                                <td className="border-0 fw-bold">
                                                    <input
                                                        className="form-control"
                                                        required
                                                        disabled={true}
                                                        value={inputField.kodeBarang}
                                                        onChange={event => handleChangeInput(inputField.kodeBarang, event)}
                                                    />
                                                </td>
                                                <td className="border-0 fw-bold">
                                                    <input
                                                        className="form-control"
                                                        required
                                                        disabled={true}
                                                        value={inputField.nama}
                                                        onChange={event => handleChangeInput(inputField.kodeBarang, event)}
                                                    />
                                                </td>
                                                <td className="border-0 fw-bold">
                                                    <input
                                                        className="form-control"
                                                        required
                                                        disabled={true}
                                                        value={inputField.merek}
                                                        onChange={event => handleChangeInput(inputField.kodeBarang, event)}
                                                    />
                                                </td>
                                                <td className="border-0 fw-bold">
                                                    <input
                                                        className="form-control"
                                                        required
                                                        name='qty'
                                                        type='number'
                                                        onKeyPress={qtykey}
                                                        onClick={event => selectallqty(inputField.kodeBarang, event)}
                                                        min="1"
                                                        value={inputField.qty}
                                                        onChange={event => handleChangeInput(inputField.kodeBarang, event)}
                                                    />
                                                </td>
                                                <td className="border-0 fw-bold">
                                                    <Button1 disabled={inputFields.length === 0} onClick={() => handleRemoveFields(inputField.kodeBarang)}>
                                                        <Minus />
                                                    </Button1>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="">
                                    </tfoot>
                                </table>
                                <Row>
                                    <Col md={4} className="mb-2 mt-3">
                                        <h3 className="" style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}></h3>
                                    </Col>
                                    <Col md={1} className="mb-2 mt-3">
                                        <h3 className="" style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}></h3>
                                    </Col>
                                    <Col md={1} className="mb-2 mt-3">
                                        <h3 className="" style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}></h3>
                                    </Col>
                                    <Col md={1} className="mb-2 mt-3">
                                        <h3 className="" style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}></h3>
                                    </Col>
                                    <Col md={4} className="mb-2 mt-3">
                                        <h3 className="" style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Total Item : {(String(totalqty))}</h3>
                                    </Col>
                                </Row>
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