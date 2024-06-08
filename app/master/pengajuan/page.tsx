"use client"
import Add from "./action/Add"
import Update from "./action/Update"
import Delete from "./action/Delete"
import Cek from "./action/Cek";
import React, { useState, useEffect } from 'react';
import { Pagination, Badge } from 'react-bootstrap';
import { warnastatus } from "@/app/helper";
import DataTable from 'react-data-table-component';
import { useSession } from "next-auth/react";
import axios from "axios";

const Pengajuan = () => {
  const session = useSession()
  const [datajobdesk, setDatajobdesk] = useState([])
  const [dataKaryawan, setDataKaryawan] = useState([])
  const [karyawanId, setKaryawanId] = useState(session.data?.karyawanId)
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchDataRequestJobdesk()
    cariKaryawan()
  }, [])

  const fetchDataRequestJobdesk = async () => {
    try {
      const response = await fetch(`/master/api/requestjobdesk`);
      const result = await response.json();
      setDatajobdesk(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const cariKaryawan = async () => {
    const response = await axios.get(`/master/api/notkaryawan`);
    const data = response.data;
    const options = data.map((item: any) => ({
        value: item.id,
        label: item.nama,
    }));
    setDataKaryawan(options)
}

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = datajobdesk.filter(
    (item: any) => item.namaJob && item.namaJob.toLowerCase().includes(filterText.toLowerCase()),
  );

  const columns = [
    {
      name: 'No',
      cell: (row: any, index: number) => <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>,
      sortable: false,
      width: '80px'
    },
    {
      name: 'Nama Tugas',
      selector: (row: any) => row.namaJob,
      sortable: true,
      width: '420px'
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row:any) => (
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
          <Update jobdesk={row} reload={fetchDataRequestJobdesk} datateam={dataKaryawan} />
          <Delete jobdeskId={row.id} reload={fetchDataRequestJobdesk} />
          <Cek jobdesk={row} findkaryawan={row.KaryawanTb}  />
        </div>
      ),
      width: '200px'
    },

  ];
  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Pengajuan Tugas</h1>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-9">
                  <Add reload={fetchDataRequestJobdesk} datateam={dataKaryawan}  />
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

export default Pengajuan