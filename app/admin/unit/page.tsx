"use client"
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Add from './action/Add';
import Update from './action/Update';
import Delete from './action/Delete';
import * as XLSX from 'xlsx';

const Unit = () => {
  const [dataunit, setDataunit] = useState([])
  const [dataul, setDataul] = useState([])
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload()
    getulay()
  }, [])

  const reload = async () => {
    try {
      const response = await fetch(`/admin/api/unit`);
      const result = await response.json();
      setDataunit(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getulay = async () => {
    try {
      const response = await fetch(`/admin/api/ul`);
      const result = await response.json();
      setDataul(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = dataunit.filter(
    (item: any) => item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase()),
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
      selector: (row: any) => row.nama,
      sortable: true,
      width: '300px'
    },
    {
      name: 'Unit Layanan',
      selector: (row: any) => row.ULTb.nama,
      width: '270px'
    },
    {
      name: 'Petugas',
      selector: (row: any) => row.petugas,
    },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="d-flex">
          <Update reload={reload} unit={row} dataulay={dataul}/>
          <Delete reload={reload} unitId={row.id} />
        </div>
      ),
    },

  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DataKaryawan');
    XLSX.writeFile(workbook, 'Data Karyawan.xlsx');
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" >Data Unit</h1>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-9">
                  <Add reload={reload} dataulay={dataul} />
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
              {/* {dataunit.length > 0 ?
                <div className="row mb-3">
                  <div className="col-md-3">
                    <button type='button' onClick={exportToExcel} className="btn btn-success btn-icon-text">
                      Ekspor ke Excel
                    </button>
                  </div>
                  <div className="col-md-9 d-flex justify-content-end">
                    <li>
                      <button type='button' onClick={exportToExcel} className="btn btn-primary btn-icon-text mx-2">
                        Download Template
                      </button>
                    </li>
                    <li>
                      <button type='button' onClick={exportToExcel} className="btn btn-info btn-icon-text">
                        Import dari Excel
                      </button>
                    </li>
                  </div>

                </div>
                :
                null
              } */}
            </div>
          </div>
        </div>
      </div >
    </div >
  )
};

export default Unit;
