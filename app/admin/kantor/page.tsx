"use client"
import axios from 'axios';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Kantor = () => {
  const [id, setId] = useState("")
  const [nama, setNama] = useState("")
  const [alamat, setAlamat] = useState("")
  const [email, setEmail] = useState("")
  const [telp, setTelp] = useState("")
  const [wa, setWa] = useState("")
  const [radius, setRadius] = useState('0')
  // const [lokasi, setLokasi] = useState("")
  const [koordinat1, setKoordinat1] = useState("")
  const [koordinat2, setKoordinat2] = useState("")

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
    reload()
  }, [])

  const reload = async () => {
    try {
      const response = await axios.get(`/admin/api/kantor`);
      const result = await response.data;
      setId(result.id);
      setNama(result.nama);
      setAlamat(result?.alamat);
      setEmail(result?.email);
      setTelp(result?.telp);
      setWa(result?.wa);
      setRadius(String(result?.radius));
      // setLokasi(result?.lokasi)
      const lokasi = result?.lokasi.split(', ');
      if (lokasi.length === 2) {
        setKoordinat1(lokasi[0]);
        setKoordinat2(lokasi[1]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleUpdate = async (e: SyntheticEvent) => {
    setIsLoading(true)
    e.preventDefault()
    const lokasi = `${koordinat1}, ${koordinat2}`;
    const formData = new FormData()
    formData.append('nama', nama)
    formData.append('alamat', alamat)
    formData.append('email', email)
    formData.append('telp', telp)
    formData.append('wa', wa)
    formData.append('lokasi', lokasi)
    formData.append('radius', radius)

    const xxx = await axios.patch(`/admin/api/kantor/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Berhasil Simpan',
      showConfirmButton: false,
      timer: 1500
    })
    setIsLoading(false)
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" >Profil Perusahaan</h1>
            </div>
            <div className="card-body">
              {/* <div className="row mb-3">
                <div className="mb-3 col-md-12 d-flex justify-content-center">
                  <div className="rounded">
                    <img className="bg-foto" />
                  </div>
                </div>
              </div> */}
              {/* <div className="p-5">
                <div className="author-profile">
                  <div className="author-media">
                    <img src='' alt={""} className="mb-3 " width={200} height={200} />
                    <div
                      className="upload-link"
                      title=""
                      data-toggle="tooltip"
                      data-placement="right"
                      data-original-title="update"
                    >
                      <input type="file" className="update-flie" accept="image/png, image/jpeg" />
                      <i className="fa fa-camera" />
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Nama</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    value={nama} onChange={(e) => setNama(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Alamat</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    value={alamat} onChange={(e) => setAlamat(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Email</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Telp</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    value={telp} onChange={(e) => setTelp(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label" style={{ color: "black" }}>WA</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    value={wa} onChange={(e) => setWa(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Lokasi</label>
                <div className="col-sm-4">
                  <input
                    type="text"
                    className="form-control"
                    value={koordinat1} onChange={(e) => setKoordinat1(e.target.value)}
                  />
                </div>
                <div className="col-sm-1"></div>
                <div className="col-sm-4">
                  <input
                    type="text"
                    className="form-control"
                    value={koordinat2} onChange={(e) => setKoordinat2(e.target.value)}
                  />
                </div>
                
              </div>
              <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label" style={{ color: "black" }}>Radius</label>
                  <div className="col-sm-9">
                    <input
                      type="number"
                      className="form-control"
                      value={radius} onChange={(e) => setRadius(e.target.value)}
                    />
                  </div>
                </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label" style={{ color: "black" }}></label>
                <div className="col-sm-9">
                  <button type="button" onClick={handleUpdate} className="btn btn-primary light">Simpan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
};

export default Kantor;
