/* eslint-disable @next/next/no-img-element */
"use client"
import React, {  useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'

const DetailBerita = ({ params }: { params: { id: string } }) => {

    const [dataBerita, setDataBerita] = useState([])

    useEffect(() => {
        fetchDataberita()
    }, [])

    async function fetchDataberita() {
        const response = await axios.get(`/admin/api/detailberita/${params.id}`);
        const result = await response.data;
        setDataBerita(result)
        console.log('ttt', result)
    };


    return (
        <div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card h-auto">
                        <div className="card-body">
                            {dataBerita.map((x: any, index) => (
                                <div className="post-details" key={x.id}>
                                    <h1 className="mb-2 text-black">
                                        {x.judul}</h1>
                                    <ul className="mb-4 post-meta d-flex flex-wrap" style={{ fontSize: 15 }}>
                                        <li className="post-author me-3">By <a style={{ fontWeight: 'bold' }}>{x.KaryawanTb.nama}</a></li>
                                        <li className="post-date me-3">
                                            <i className="far fa-calendar-plus me-2" />
                                            {moment(x.createdAt).format('DD MMMM YYYY')}
                                        </li>
                                        <li className="post-comment">
                                            <i className="far fa-comment me-2" />
                                            28
                                        </li>
                                    </ul>
                                    <img
                                        src={`/upload/${x.foto}`}
                                        alt=""
                                        className="img-fluid mb-3 w-100 rounded"
                                    />
                                    <div className='mt-3' style={{ fontSize: 15 }} dangerouslySetInnerHTML={{ __html: x.isi }}></div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}

export default DetailBerita