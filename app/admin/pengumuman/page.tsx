"use client"
import Add from "./action/Add"
import Update from "./action/Update"
import Delete from "./action/Delete"
import React, { useState, useEffect } from 'react';
import { Pagination, } from 'react-bootstrap';
import moment from "moment";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { tanggalIndo } from "@/app/helper";


const Pengumuman = () => {
  const [datapengumuman, setDatapengumuman] = useState([])
  const [selectdivisi, setSelectdivisi] = useState([])
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload()
    divisi()
  }, [])

  const reload = async () => {
    try {
      const response = await fetch(`/admin/api/pengumuman`);
      const result = await response.json();
      setDatapengumuman(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const divisi = async () => {
    const data: any = [
      { value: 'Admin', label: 'Admin' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'PIC', label: 'PIC' },
      { value: 'Logistik', label: 'Logistik' },
      { value: 'Teknisi', label: 'Teknisi' },
    ];
    const options = data.map((item: any) => ({
      value: item.value,
      label: item.label,
    }));
    setSelectdivisi(options);
  }

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = datapengumuman.filter(
    (item: any) => item.judul && item.judul.toLowerCase().includes(filterText.toLowerCase()),
  );

  const columns = [
    {
      name: 'No',
      cell: (row: any, index: number) => <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>,
      sortable: false,
      width: '80px'
    },
    {
      name: 'Judul',
      selector: (row: any) => row.judul,
      sortable: true,
      width: '420px'
    },
    {
      name: 'Tanggal',
      selector: (row: any) => tanggalIndo(row.tanggalPengumuman),

    },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="d-flex">
          <Update pengumuman={row} reload={reload} daftardivisi={selectdivisi} />
          <Delete pengumumanId={row.id} reload={reload} />
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
              <h1 className="card-title">Data Pengumuman</h1>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-9">
                  <Add reload={reload} daftardivisi={selectdivisi} />
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
}

export default Pengumuman