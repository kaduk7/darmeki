"use client"
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { ambiljamindo, ambiltanggalindo, formattanggaljakarta, mingguDepan, tanggalHariIni, tanggalIndo, warnastatus } from "@/app/helper";
import * as XLSX from 'xlsx';
import moment from "moment";
import 'moment/locale/id';
moment.locale('id');

const processAbsensi = (data:any) => {
  const masukRecords = data.filter((item:any) => item.keterangan === 'Masuk');
  const pulangRecords = data.filter((item:any) => item.keterangan === 'Pulang');

  const combinedRecords = [...masukRecords, ...pulangRecords].reduce((acc, item) => {
    const key = `${item.karyawanId}-${new Date(item.createdAt).toLocaleDateString()}`;
    if (!acc[key]) {
      acc[key] = {
        karyawanId: item.karyawanId,
        tanggal: new Date(item.createdAt).toLocaleDateString(),
        masuk: null,
        pulang: null,
      };
    }
    if (item.keterangan === 'Masuk') {
      if (!acc[key].masuk || new Date(item.createdAt) < new Date(acc[key].masuk.createdAt)) {
        acc[key].masuk = item;
      }
    } else if (item.keterangan === 'Pulang') {
      if (!acc[key].pulang || new Date(item.createdAt) > new Date(acc[key].pulang.createdAt)) {
        acc[key].pulang = item;
      }
    }
    return acc;
  }, {});

  return Object.values(combinedRecords);
};

const processMasuk = (data: any) => {
  const filteredRecords = data.filter((item: any) => item.keterangan === 'Masuk');
  const earliestRecords = filteredRecords.reduce((acc: any, item: any) => {
    const key = `${item.karyawanId}-${new Date(item.createdAt).toLocaleDateString()}`;
    if (!acc[key] || new Date(item.createdAt) < new Date(acc[key].createdAt)) {
      acc[key] = item;
    }
    return acc;
  }, {});
  return Object.values(earliestRecords);
};

const processPulang = (data: any) => {
  const filteredRecords = data.filter((item: any) => item.keterangan === 'Pulang');
  const earliestRecords = filteredRecords.reduce((acc: any, item: any) => {
    const key = `${item.karyawanId}-${new Date(item.createdAt).toLocaleDateString()}`;
    if (!acc[key] || new Date(item.createdAt) > new Date(acc[key].createdAt)) {
      acc[key] = item;
    }
    return acc;
  }, {});
  return Object.values(earliestRecords);
};

const Absen = () => {
  const [dataabsen, setDataAbsen] = useState([])
  const [dataawal, setDataawal] = useState([])
  const [tanggalawal, setTanggalawal] = useState(tanggalHariIni)
  const [tanggalakhir, setTanggalakhir] = useState(mingguDepan)
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    reload()
  }, [])

  const reload = async () => {
    try {
      const response = await fetch(`/admin/api/absen`);
      const result = await response.json();


      const filteredMasuk: any = processMasuk(result);
      const filteredPulang: any = processPulang(result);
      const combinedData: any = [...filteredMasuk, ...filteredPulang];
      combinedData.sort((a: any, b: any) => {
        if (a.KaryawanTb.nama < b.KaryawanTb.nama) return -1;
        if (a.KaryawanTb.nama > b.KaryawanTb.nama) return 1;
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
      });

      setDataAbsen(result);
      setDataawal(result);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = dataabsen.filter(
    (item: any) => item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase()),
  );

  console.log('urutan', filteredItems)

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
      // width: '300px'
    },
    {
      name: 'Tanggal',
      cell: (row:any) => (
        <div>
          {processAbsensi(row.AbsensiTb).map((absen:any, index) => (
             <div key={index} style={{ marginBottom: '8px' }}>
             {absen.masuk && (
              <p style={{ padding: '4px', borderRadius: '4px' }}>
                 {tanggalIndo(absen.masuk.createdAt)}
               </p>
             )}
             {absen.pulang && (
              <p style={{ padding: '4px', borderRadius: '4px' }}>
                 {tanggalIndo(absen.pulang.createdAt)}
               </p>
             )}
           </div>
          ))}
        </div>
      ),
      sortable: false,
    },
    {
      name: 'Jam',
      cell: (row:any) => (
        <div>
          {processAbsensi(row.AbsensiTb).map((absen:any, index) => (
             <div key={index} style={{ marginBottom: '8px' }}>
             {absen.masuk && (
               <p style={{ padding: '4px', borderRadius: '4px' }}>
                 {ambiljamindo(absen.masuk.createdAt)}
               </p>
             )}
             {absen.pulang && (
              <p style={{ padding: '4px', borderRadius: '4px' }}>
                 {ambiljamindo(absen.pulang.createdAt)}
               </p>
             )}
           </div>
          ))}
        </div>
      ),
      sortable: false,
    },
    {
      name: 'Keterangan',
      cell: (row:any) => (
        <div>
          {processAbsensi(row.AbsensiTb).map((absen:any, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
            {absen.masuk && (
                <p style={{ backgroundColor: '#00ff8c',padding: '4px', borderRadius: '4px' }}>
                   {absen.masuk.keterangan}
                </p>
              )}
            {absen.pulang && (
                <p style={{ backgroundColor: '#ffa500',padding: '4px', borderRadius: '4px' }}>
                  {absen.pulang.keterangan}
                </p>
              )}
          </div>
          ))}
        </div>
      ),
      sortable: false,
      // width: '400px'
    },
    
  ];

  const conditionalRowStyles = [
    {
      when: (row: any) => row.keterangan === 'Masuk',
      style: {
        backgroundColor: '#00ff8c',
        color: '#000',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {

      when: (row: any) => row.keterangan === 'Pulang',
      style: {
        backgroundColor: '#ffa500',
        color: '#000',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    }
  ];

  // const showw = async () => {
  //   const awal = new Date(tanggalawal).toISOString()
  //   const akhir = new Date(tanggalakhir + 'T23:59:59.999Z').toISOString()
  //   const xxx: any = dataawal.filter((item: any) => formattanggaljakarta(item.createdAt) >= awal && formattanggaljakarta(item.createdAt) <= akhir)
  //   setDataAbsen(xxx);
  // }

  const showw = async () => {
    const awal = new Date(tanggalawal);
    const akhir = new Date(tanggalakhir + 'T23:59:59.999Z');
    const filteredData:any = dataawal.map((karyawan:any) => {
      const filteredAbsensi = karyawan.AbsensiTb.filter((absen:any) => {
        const absenDate = new Date(absen.createdAt);
        return absenDate >= awal && absenDate <= akhir;
      });
      return { ...karyawan, AbsensiTb: filteredAbsensi };
    }).filter(karyawan => karyawan.AbsensiTb.length > 0);
    setDataAbsen(filteredData);
  };

  const reset = () => {
    // reload()
    setDataAbsen(dataawal);
    setTanggalawal(tanggalHariIni)
    setTanggalakhir(mingguDepan)
    setFilterText('')
  }

  const exportToExcelperKaryawan = () => {

    // const dataToExport = filteredItems.map((item: any) => ({
    //   Nama: item.KaryawanTb.nama,
    //   Tanggal: ambiltanggalindo(item.createdAt),
    //   Jam: ambiljamindo(item.createdAt),
    //   Keterangan: item.keterangan,
    //   bulan: moment(item.createdAt).format('MMMM YYYY')
    // }));

    // if (dataToExport.length === 0) {
    //   console.error("No data to export");
    //   return;
    // }

    // const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    // const workbook = XLSX.utils.book_new();
    // const nama = dataToExport[0].Nama;
    // const bulan = dataToExport[0].bulan;
    // XLSX.utils.book_append_sheet(workbook, worksheet, `${nama}`);
    // XLSX.writeFile(workbook, `Absen ${nama} ${bulan}.xlsx`);
    const dataToExport = filteredItems.map((item:any) => {
      return item.AbsensiTb.map((absen:any) => ({
        Nama: item.nama,
        Divisi: item.divisi,
        'Tanggal Absensi': moment(absen.createdAt).format('DD MMM YYYY'),
        'Jam Absensi': moment(absen.createdAt).format('HH:mm:ss'),
        Keterangan: absen.keterangan,
        bulan: moment(absen.createdAt).format('MMMM YYYY')
      }));
    }).flat();

    if (dataToExport.length === 0) {
      console.error("No data to export");
      return;
    }
    const nama = dataToExport[0].Nama;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Absen Karyawan');
    XLSX.writeFile(workbook, `Absen ${nama}.xlsx`);
  };

  // const exportToExcel = () => {

  //   const dataToExport = filteredItems.map((item: any) => ({
  //     Nama: item.KaryawanTb.nama,
  //     Tanggal: ambiltanggalindo(item.createdAt),
  //     Jam: ambiljamindo(item.createdAt),
  //     Keterangan: item.keterangan,
  //     bulan: moment(item.createdAt).format('MMMM YYYY')
  //   }));

  //   if (dataToExport.length === 0) {
  //     console.error("No data to export");
  //     return;
  //   }

  //   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const workbook = XLSX.utils.book_new();
  //   const bulan = dataToExport[0].bulan;
  //   XLSX.utils.book_append_sheet(workbook, worksheet, `Absen Karyawan`);
  //   XLSX.writeFile(workbook, `Absen Karyawan ${bulan}.xlsx`);
  // };

  const exportToExcel = () => {
    const dataToExport = filteredItems.map((item:any) => {
      return item.AbsensiTb.map((absen:any) => ({
        Nama: item.nama,
        Divisi: item.divisi,
        'Tanggal Absensi': moment(absen.createdAt).format('DD MMM YYYY'),
        'Jam Absensi': moment(absen.createdAt).format('HH:mm:ss'),
        Keterangan: absen.keterangan,
      }));
    }).flat();

    if (dataToExport.length === 0) {
      console.error("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Absen Karyawan');
    XLSX.writeFile(workbook, 'Absen_Karyawan.xlsx');
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Data Absen</h1>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-2">
                  <div className="row">
                    <div className="mb-3 col-md-12">
                      <label className="form-label" style={{ color: "black", borderColor: "grey" }}>Tanggal Awal</label>
                      <input
                        autoFocus
                        required
                        type="date"
                        className="form-control"
                        style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                        value={tanggalawal}
                        onChange={(e) => { setTanggalawal(e.target.value); console.log('tgl', e.target.value); }}
                      />

                    </div>

                  </div>
                </div>
                <div className="col-md-2">
                  <div className="row">
                    <div className="mb-3 col-md-12">
                      <label className="form-label" style={{ color: "black", borderColor: "grey" }}>Tanggal Akhir</label>
                      <input
                        autoFocus
                        required
                        type="date"
                        className="form-control"
                        style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                        value={tanggalakhir}
                        onChange={(e) => { setTanggalakhir(e.target.value); console.log('tgla', e.target.value); }}
                      />
                    </div>

                  </div>
                </div>
                <div className="col-md-5">
                  <div className="row">
                    <div className="mb-1 col-md-12">

                      <button type='button' onClick={showw} className="btn btn-info btn-icon-text me-1" style={{ width: 120 }}>
                        Cari
                      </button>


                      <button type='button' onClick={reset} className="btn btn-danger btn-icon-text me-1" style={{ width: 120 }}>
                        Refresh
                      </button>

                      <button type='button' onClick={filterText === '' ? exportToExcel : exportToExcelperKaryawan} className="btn btn-success btn-icon-text me-1" style={{ width: 120 }}>
                        Ekspor ke Excel
                      </button>
                    </div>

                  </div>
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
                conditionalRowStyles={conditionalRowStyles}
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

export default Absen