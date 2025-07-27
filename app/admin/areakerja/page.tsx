"use client"
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Add from './action/Add';
import Delete from './action/Delete';

const Ruteuser = () => {
  const [dataareakerjaall, setDataareakerjaAll] = useState([])
  const [dataareakerja, setDataareakerja] = useState([])
  const [dataul, setDataul] = useState([])
  const [datarute, setDatarute] = useState([])
  const [ulId, setUlId] = useState('')
  const [ruteid, setRuteid] = useState('')
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload()
    daftarzona()
  }, [])

  const reload = async () => {
    try {
      const response = await fetch(`/admin/api/areakerja`);
      const result = await response.json();
      setDataareakerjaAll(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const daftarzona = async () => {
    try {
      const response = await fetch(`/admin/api/ul`);
      const result = await response.json();
      setDataul(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const reloadId = async (ruteid:String) => {
    const response = await fetch(`/admin/api/areakerja/${ruteid}`)
    const result = await response.json();
    setDataareakerja(result);
  }

  const onUl = async (e: any) => {
    if (e.target.value === '') {
      setRuteid('')
    }
    setUlId(e.target.value)
    const response = await fetch(`/admin/api/areakerja/${e.target.value}`)
    const result = await response.json();
    setDataareakerja(result)
  }


  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = dataareakerja.filter(
    (item: any) => item.KaryawanTb.nama && item.KaryawanTb.nama.toLowerCase().includes(filterText.toLowerCase()),
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
      selector: (row: any) => row.KaryawanTb.nama,
      sortable: true,
    },
    {
      name: 'No Hp',
      selector: (row: any) => row.KaryawanTb.hp,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="d-flex">
          <Delete reload={reload} reloadId={reloadId} ulId={ulId} areakerjaId={row.id}  />
        </div>
      ),
      width: '150px'
    },

  ];

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title col-md-5 ">Unit Layanan Karyawan</h1>
              <div className="card-title col-md-3">
                <div className="row">
                  <div className="mb-3 col-md-12">
                    <h6 className="form-label" >Unit Layanan</h6>
                    <select
                      required
                      autoFocus
                      className="form-control"
                      value={ulId} onChange={onUl}>
                      <option value={''} disabled={ulId!==''}> Pilih Unit Layanan</option>
                      {dataul?.map((item: any, i) => (
                        <option key={i} value={item.id} >{item.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
            </div>
            <div className="card-body">
              {ulId === '' ?
                <div>Silahkan Pilih Rute terlebih dahulu</div>
                :
                <>
                  <div className="row mb-3">
                    <div className="col-md-9">
                      <Add reload={reload} reloadId={reloadId} ulId={ulId} dataAll={dataareakerjaall} />
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
                </>
              }
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Ruteuser