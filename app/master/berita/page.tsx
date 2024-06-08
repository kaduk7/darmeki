/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useEffect, useState } from 'react'
import Add from './action/Add'
import Update from './action/Update'
import Delete from './action/Delete'
import Link from 'next/link'
import Komentar from './action/Komentar'
import { supabaseUrl, supabaseBUCKET, kalkulasiWaktu } from '@/app/helper'

const Berita = () => {
    const [dataBerita, setDataBerita] = useState([])
    const [karyawanId, setKaryawanId] = useState('')
    const [namaAvatar, setNamaAvatar] = useState('')
    const [nama, setNama] = useState('')
    const [email, setEmail] = useState("")
    const [namaDivisi, setNamadivisi] = useState("")
    const [foto, setFoto] = useState("")
    const [preview, setPreview] = useState("")

    useEffect(() => {
        fetchDataberita()
        fetchDataprofil()
    }, [])

    const fetchDataprofil = async () => {
        try {
            const response = await fetch(`/admin/api/profil`);
            const result = await response.json();
            setKaryawanId(result.id)
            setNama(result.nama);
            setNamaAvatar(result.nama);
            setNamadivisi(result.DivisiTb.nama)
            setFoto(result?.foto)
            setEmail(result.email)
            setPreview(result?.foto)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const fetchDataberita = async () => {
        try {
            const response = await fetch(`/admin/api/berita`);
            const result = await response.json();
            setDataBerita(result)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
        <div>
            <div className="row">
                <div className="col-xl-4">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="profile-statistics">
                                        <div className="text-center">
                                            <div className="row">
                                                <div className="col">
                                                    <h3 className="m-b-0">150</h3>
                                                    <span>Follower</span>
                                                </div>
                                                <div className="col">
                                                    <h3 className="m-b-0">140</h3>
                                                    <span>Place Stay</span>
                                                </div>
                                                <div className="col">
                                                    <h3 className="m-b-0">45</h3>
                                                    <span>Reviews</span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <a
                                                    href=""
                                                    className="btn btn-primary light light mb-1 me-1"
                                                >
                                                    Follow
                                                </a>
                                                <a
                                                    href=""
                                                    className="btn btn-primary light light mb-1 me-1"
                                                >
                                                    Send Message
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="profile-interest">
                                        <h5 className="text-primary d-inline">Gallery</h5>

                                        <div className="row mt-4 sp4" >
                                            {dataBerita.map((x: any, index) => (

                                                <a
                                                    key={x.id}
                                                    href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/berita-images/${x.foto}`}
                                                    target="_blank"
                                                    data-exthumbimage="images/profile/2.jpg"
                                                    data-src="images/profile/2.jpg"
                                                    className="mb-1 col-lg-4 col-xl-4 col-sm-4 col-6"
                                                >
                                                    <img
                                                        src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/berita-images/${x.foto}`}
                                                        alt=""
                                                        className="px-1 py-1 img-fluid rounded"
                                                    />
                                                </a>
                                            ))}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card h-auto">
                        <div className="card-body">
                            <div className="profile-tab">
                                <div className="custom-tab-1">
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <a
                                                href="#my-posts"
                                                data-bs-toggle="tab"
                                                className="nav-link active show"
                                            >
                                                Posts
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="my-posts" className="tab-pane fade active show">
                                            <>
                                                <Add idkaryawan={Number(karyawanId)} reload={fetchDataberita} />
                                                {dataBerita.map((x: any, index) => (
                                                    <div className="col-xl-12" key={x.id}>
                                                        <div className="card">
                                                            <div className="card-header border-0">
                                                                <div className="products">
                                                                    <img
                                                                        src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${x.KaryawanTb.foto}`}
                                                                        className="avatar avatar-md rounded-circle"
                                                                        alt=""
                                                                    />

                                                                    <div>
                                                                        <h5 className="mb-0">
                                                                            <a href="#" className="text-black" style={{ fontSize: 17 }}>
                                                                                <u> {x.KaryawanTb.nama}</u>
                                                                            </a>
                                                                        </h5>
                                                                        <span>{kalkulasiWaktu(x.createdAt)}</span>
                                                                    </div>
                                                                </div>
                                                                {String(x.karyawanId) === String(karyawanId) ?

                                                                    <div className="dropdown custom-dropdown ">
                                                                        <div
                                                                            className="btn sharp btn-primary light tp-btn  ms-3"
                                                                            data-bs-toggle="dropdown"
                                                                        >
                                                                            <svg
                                                                                width={15}
                                                                                height={15}
                                                                                viewBox="0 0 22 22"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M13.5202 17.4167C13.5202 18.81 12.3927 19.9375 10.9994 19.9375C9.60601 19.9375 8.47852 18.81 8.47852 17.4167C8.47852 16.0233 9.60601 14.8958 10.9994 14.8958C12.3927 14.8958 13.5202 16.0233 13.5202 17.4167ZM9.85352 17.4167C9.85352 18.0492 10.3669 18.5625 10.9994 18.5625C11.6319 18.5625 12.1452 18.0492 12.1452 17.4167C12.1452 16.7842 11.6319 16.2708 10.9994 16.2708C10.3669 16.2708 9.85352 16.7842 9.85352 17.4167Z"
                                                                                    fill="#2696FD"
                                                                                />
                                                                                <path
                                                                                    d="M13.5202 4.58369C13.5202 5.97699 12.3927 7.10449 10.9994 7.10449C9.60601 7.10449 8.47852 5.97699 8.47852 4.58369C8.47852 3.19029 9.60601 2.06279 10.9994 2.06279C12.3927 2.06279 13.5202 3.19029 13.5202 4.58369ZM9.85352 4.58369C9.85352 5.21619 10.3669 5.72949 10.9994 5.72949C11.6319 5.72949 12.1452 5.21619 12.1452 4.58369C12.1452 3.95119 11.6319 3.43779 10.9994 3.43779C10.3669 3.43779 9.85352 3.95119 9.85352 4.58369Z"
                                                                                    fill="#2696FD"
                                                                                />
                                                                                <path
                                                                                    d="M13.5202 10.9997C13.5202 12.393 12.3927 13.5205 10.9994 13.5205C9.60601 13.5205 8.47852 12.393 8.47852 10.9997C8.47852 9.6063 9.60601 8.4788 10.9994 8.4788C12.3927 8.4788 13.5202 9.6063 13.5202 10.9997ZM9.85352 10.9997C9.85352 11.6322 10.3669 12.1455 10.9994 12.1455C11.6319 12.1455 12.1452 11.6322 12.1452 10.9997C12.1452 10.3672 11.6319 9.8538 10.9994 9.8538C10.3669 9.8538 9.85352 10.3672 9.85352 10.9997Z"
                                                                                    fill="#2696FD"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <a>
                                                                                <Update berita={x} reload={fetchDataberita}/>
                                                                            </a>
                                                                            <a>
                                                                                <Delete beritaId={x.id} beritafoto={x.foto} reload={fetchDataberita}/>
                                                                            </a>
                                                                            <a className="dropdown-item" >
                                                                                Option 3
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    namaDivisi === 'Admin' ?
                                                                        <div className="dropdown custom-dropdown ">
                                                                            <div
                                                                                className="btn sharp btn-primary light tp-btn  ms-3"
                                                                                data-bs-toggle="dropdown"
                                                                            >
                                                                                <svg
                                                                                    width={15}
                                                                                    height={15}
                                                                                    viewBox="0 0 22 22"
                                                                                    fill="none"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                >
                                                                                    <path
                                                                                        d="M13.5202 17.4167C13.5202 18.81 12.3927 19.9375 10.9994 19.9375C9.60601 19.9375 8.47852 18.81 8.47852 17.4167C8.47852 16.0233 9.60601 14.8958 10.9994 14.8958C12.3927 14.8958 13.5202 16.0233 13.5202 17.4167ZM9.85352 17.4167C9.85352 18.0492 10.3669 18.5625 10.9994 18.5625C11.6319 18.5625 12.1452 18.0492 12.1452 17.4167C12.1452 16.7842 11.6319 16.2708 10.9994 16.2708C10.3669 16.2708 9.85352 16.7842 9.85352 17.4167Z"
                                                                                        fill="#2696FD"
                                                                                    />
                                                                                    <path
                                                                                        d="M13.5202 4.58369C13.5202 5.97699 12.3927 7.10449 10.9994 7.10449C9.60601 7.10449 8.47852 5.97699 8.47852 4.58369C8.47852 3.19029 9.60601 2.06279 10.9994 2.06279C12.3927 2.06279 13.5202 3.19029 13.5202 4.58369ZM9.85352 4.58369C9.85352 5.21619 10.3669 5.72949 10.9994 5.72949C11.6319 5.72949 12.1452 5.21619 12.1452 4.58369C12.1452 3.95119 11.6319 3.43779 10.9994 3.43779C10.3669 3.43779 9.85352 3.95119 9.85352 4.58369Z"
                                                                                        fill="#2696FD"
                                                                                    />
                                                                                    <path
                                                                                        d="M13.5202 10.9997C13.5202 12.393 12.3927 13.5205 10.9994 13.5205C9.60601 13.5205 8.47852 12.393 8.47852 10.9997C8.47852 9.6063 9.60601 8.4788 10.9994 8.4788C12.3927 8.4788 13.5202 9.6063 13.5202 10.9997ZM9.85352 10.9997C9.85352 11.6322 10.3669 12.1455 10.9994 12.1455C11.6319 12.1455 12.1452 11.6322 12.1452 10.9997C12.1452 10.3672 11.6319 9.8538 10.9994 9.8538C10.3669 9.8538 9.85352 10.3672 9.85352 10.9997Z"
                                                                                        fill="#2696FD"
                                                                                    />
                                                                                </svg>
                                                                            </div>
                                                                            <div className="dropdown-menu dropdown-menu-end">
                                                                                <a>
                                                                                    <Delete beritaId={x.id} beritafoto={x.foto} reload={fetchDataberita}/>
                                                                                </a>
                                                                                <a className="dropdown-item" >
                                                                                    Option 3
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        null}
                                                            </div>
                                                            <div className="card-body pt-0">
                                                                <div className="post-img">
                                                                    <img
                                                                        src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/berita-images/${x.foto}`}
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className="post-see d-flex align-items-center mt-3">
                                                                    <Link href={`/master/detailberita/${x.id}`} className="mb-0 ms-3"><h2>{x.judul}</h2></Link>
                                                                </div>
                                                                <div className="mt-3 ms-3">
                                                                    <div className='col'>
                                                                        <a>
                                                                            <span style={{ fontSize: 15 }} className={'two-line-paragraph'} dangerouslySetInnerHTML={{ __html: x.isi }} />
                                                                        </a>
                                                                    </div>

                                                                </div>
                                                                <ul className="post-comment d-flex mt-3">
                                                                    <li>
                                                                        <label className="me-3">
                                                                            <a href="">
                                                                                <i className="fa-regular fa-heart me-2" />
                                                                                Like
                                                                            </a>
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <Komentar berita={x} karyawan={x.KaryawanTb} idkaryawan={Number(karyawanId)} kirimfoto={foto} />
                                                                    </li>
                                                                    <li>
                                                                        <label className="me-3">
                                                                            <a href="">
                                                                                <i className="fa-solid fa-share me-2" />
                                                                                Share
                                                                            </a>
                                                                        </label>{" "}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            </>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Berita