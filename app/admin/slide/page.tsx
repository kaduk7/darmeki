"use client"
import React, { useEffect, useState } from 'react';
import Add from './action/Add';
import Delete from './action/Delete';
import { supabaseUrl, supabaseBUCKET } from '@/app/helper'

const Slide = () => {
  const [dataslide, setDataslide] = useState([])

  useEffect(() => {
    reload()
  }, [])

  const reload = async () => {
    try {
      const response = await fetch(`/admin/api/slide`);
      const result = await response.json();
      setDataslide(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div>
      <div className="row">
        {dataslide.map((x: any, index) => (
          <div className="col-lg-12 col-xl-4 col-xxl-4" key={x.id}>
            <div className="card">
              <div className="card-body">
                <div className="col m-b-30">
                  <div className="row-md-5 col-xxl-12 mb-3">
                    <div className="new-arrival-product mb-4 mb-xxl-4 mb-md-0">
                      <div className="new-arrivals-img-contnent">
                        <img
                          src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-slide/${x.gambar}`}
                          className=""
                          width={300}
                          height={200}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row-md-7 col-xxl-12 ">
                    <div className="new-arrival-content position-relative">
                      <div className="row m-b-30">
                        <div className="col-md-10">
                          <h4>
                            <a>
                              {x.judul}
                            </a>
                          </h4>
                        </div>
                        <div className="col-md-2">
                          <h4>
                            <a>
                              <Delete reload={reload} slideId={x.id} slideFoto={x.gambar} />
                            </a>
                          </h4>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Add reload={reload} />
      </div>

    </div >
  )
}

export default Slide