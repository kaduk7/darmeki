"use client"
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Add from './action/Add';
import Update from './action/Update';
import Delete from './action/Delete';
import { tanggalIndo, warnastatus } from '@/app/helper';

const Peminjaman = () => {
  const [datapeminjaman, setDatapeminjaman] = useState([])
  const [databarang, setDatabarang] = useState([])
  const [datakaryawan, setDatakaryawan] = useState([])
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload()
    getbarang()
    getkaryawan()
  }, [])

  const reload = async () => {
    try {
      const response = await fetch(`/master/api/peminjaman`);
      const result = await response.json();
      setDatapeminjaman(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getbarang = async () => {
    try {
      const response = await fetch(`/master/api/inventaris`);
      const result = await response.json();
      setDatabarang(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getkaryawan = async () => {
    try {
      const response = await fetch(`/admin/api/karyawan`);
      const result = await response.json();
      setDatakaryawan(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = datapeminjaman.filter(
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
      name: 'Tanggal',
      selector: (row: any) => tanggalIndo(row.tanggal),
    },
    {
      name: 'Jumlah Barang',
      selector: (row: any) => row.total,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row: any) => (
        <div
          style={{
            backgroundColor: warnastatus(row.status),
            padding: '8px',
            borderRadius: '4px',
            color: 'black',
          }}
        >
          {row.status}
        </div>
      ),
    },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="d-flex">
          <Update reload={reload} barang={row} />
          <Delete reload={reload} peminjamanId={row.id} />
        </div>
      ),
    },
  ];


  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Data Peminjaman Barang</h1>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-9">
                  <Add reload={reload} datakaryawan={datakaryawan} databarang={databarang} />
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
                      fontSize: 15,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div >
    </div >
  )
};

export default Peminjaman;
