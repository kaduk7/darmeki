import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
const tombol = () => {
    Swal.fire({
        title: "Anda Yakin..?",
        text: "Logout dari akun ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, logout sekarang!"
    }).then((result) => {
        if (result.isConfirmed) {
            signOut()
        }
    });
}

export default function MenuPIC() {
    const session = useSession()
    return (
        <div className="deznav">
            <div className="deznav-scroll">
                <ul className="metismenu" id="menu">
                    <li className="menu-title">System</li>
                    <li>
                        <Link href="/" className="" aria-expanded="false">
                            <div className="menu-icon">
                                <svg width={25} height={24} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"  >
                                    <path d="M3.29077 9L12.2908 2L21.2908 9V20C21.2908 20.5304 21.0801 21.0391 20.705 21.4142C20.3299 21.7893 19.8212 22 19.2908 22H5.29077C4.76034 22 4.25163 21.7893 3.87656 21.4142C3.50149 21.0391 3.29077 20.5304 3.29077 20V9Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.29077 22V12H15.2908V22" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="nav-text">Dashboard</span>
                        </Link>
                    </li>

                    {session?.data?.hakAksesDatakaryawan === 'Ya' ?
                        <li>
                            <a href="#master" className="has-arrow " aria-expanded="false">
                                <div className="menu-icon">
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                        width={25} height={24}
                                    >
                                        <path d="M21 5 A9 3 0 0 1 12 8 A9 3 0 0 1 3 5 A9 3 0 0 1 21 5 z" />
                                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                                    </svg>

                                </div>
                                <span className="nav-text">Master Data</span>
                            </a>
                            <ul aria-expanded="false" id="master">
                                <li className="mini-dashboard">Master Data</li>
                                <li>
                                    <Link href="/admin/divisi">Data Divisi</Link>
                                </li>
                                <li>
                                    <Link href="/admin/karyawan">Data Karyawan</Link>
                                </li>
                            </ul>
                        </li>
                        :
                        null
                    }


                    <li className="menu-title">Tugas</li>

                    {session?.data?.hakAksesJobdesk === 'Ya' ?
                        <li>
                            <a href="#master" className="has-arrow " aria-expanded="false">
                                <div className="menu-icon">
                                    <svg
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        width={25} height={24}
                                    >
                                        <path d="M447.68 220.78a16.44 16.44 0 00-1-3.1l-48-112A16 16 0 00384 96H128a16 16 0 00-14.71 9.7l-48 112a16.44 16.44 0 00-1 3.1A16.15 16.15 0 0064 224v184a8 8 0 008 8h32a8 8 0 008-8v-24h288v24a8 8 0 008 8h32a8 8 0 008-8V224a16.15 16.15 0 00-.32-3.22zM144 320a32 32 0 1132-32 32 32 0 01-32 32zm224 0a32 32 0 1132-32 32 32 0 01-32 32zM104.26 208l34.29-80h234.9l34.29 80z" />
                                    </svg>

                                </div>
                                <span className="nav-text">Admin Jobdesk</span>
                            </a>
                            <ul aria-expanded="false" id="master">
                                <li className="mini-dashboard">Jobdesk</li>
                                <li>
                                    <Link href="/admin/tambahjobdesk">Tambah Jobdesk</Link>
                                </li>
                                <li>
                                    <Link href="/admin/pengajuanjobdesk">Pengajuan Jobdesk</Link>
                                </li>
                                <li>
                                    <Link href="/admin/jobdeskdone">Data Jobdesk</Link>
                                </li>
                            </ul>
                        </li>
                        :
                        null
                    }

                    <li>
                        <a href="#master" className="has-arrow " aria-expanded="false">
                            <div className="menu-icon">
                                <svg
                                    viewBox="0 0 512 512"
                                    fill="currentColor"
                                    width={25} height={24}
                                >
                                    <path d="M447.68 220.78a16.44 16.44 0 00-1-3.1l-48-112A16 16 0 00384 96H128a16 16 0 00-14.71 9.7l-48 112a16.44 16.44 0 00-1 3.1A16.15 16.15 0 0064 224v184a8 8 0 008 8h32a8 8 0 008-8v-24h288v24a8 8 0 008 8h32a8 8 0 008-8V224a16.15 16.15 0 00-.32-3.22zM144 320a32 32 0 1132-32 32 32 0 01-32 32zm224 0a32 32 0 1132-32 32 32 0 01-32 32zM104.26 208l34.29-80h234.9l34.29 80z" />
                                </svg>

                            </div>
                            <span className="nav-text">Jobdesk</span>
                        </a>
                        <ul aria-expanded="false" id="master">
                            <li className="mini-dashboard">Tugas</li>
                            <li>
                                <Link href="/master/datajobdesk">Agenda Tugas</Link>
                            </li>
                            <li>
                                <Link href="/master/pengajuan">Pengajuan Tugas</Link>
                            </li>
                            {/* <li>
                                <Link href="/master/requesttugas">Request Tugas</Link>
                            </li> */}
                            <li>
                                <Link href="/master/verifikasi">Verifikasi Tugas</Link>
                            </li>

                        </ul>
                    </li>

                    {session?.data?.hakAksesInformasi === 'Ya' ?
                        <li>
                            <Link href="/admin/berita" className="" aria-expanded="false">
                                <div className="menu-icon">
                                    <svg width={25} height={24} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.6209 16.593H4.32019" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M13.4313 6.90066H19.732" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.01706 6.84625C9.01706 5.5506 7.9589 4.5 6.65392 4.5C5.34893 4.5 4.29077 5.5506 4.29077 6.84625C4.29077 8.14191 5.34893 9.19251 6.65392 9.19251C7.9589 9.19251 9.01706 8.14191 9.01706 6.84625Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M20.2907 16.5533C20.2907 15.2576 19.2334 14.207 17.9284 14.207C16.6226 14.207 15.5645 15.2576 15.5645 16.5533C15.5645 17.8489 16.6226 18.8995 17.9284 18.8995C19.2334 18.8995 20.2907 17.8489 20.2907 16.5533Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="nav-text">Informasi</span>
                            </Link>
                        </li>
                        :
                        null
                    }

                    <li>
                        <a href="#master" className="has-arrow " aria-expanded="false">
                            <div className="menu-icon">
                                <svg width={25} height={24} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.6209 16.593H4.32019" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.4313 6.90066H19.732" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.01706 6.84625C9.01706 5.5506 7.9589 4.5 6.65392 4.5C5.34893 4.5 4.29077 5.5506 4.29077 6.84625C4.29077 8.14191 5.34893 9.19251 6.65392 9.19251C7.9589 9.19251 9.01706 8.14191 9.01706 6.84625Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20.2907 16.5533C20.2907 15.2576 19.2334 14.207 17.9284 14.207C16.6226 14.207 15.5645 15.2576 15.5645 16.5533C15.5645 17.8489 16.6226 18.8995 17.9284 18.8995C19.2334 18.8995 20.2907 17.8489 20.2907 16.5533Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="nav-text">Informasi</span>
                        </a>
                        <ul aria-expanded="false" id="master">
                            <li className="mini-dashboard">Informasi</li>
                            <li>
                                <Link href="/master/profil">Setting</Link>
                            </li>
                            <li>
                                <Link href="/master/pengumuman">Pengumuman</Link>
                            </li>
                            <li>
                                <Link href="/master/berita">Berita</Link>
                            </li>
                        </ul>
                    </li>

                    {/* <li>
                        <Link href="/kasir/daftarbarang" className="" aria-expanded="false">
                            <div className="menu-icon">
                                <svg width={25} height={24} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.6209 16.593H4.32019" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.4313 6.90066H19.732" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.01706 6.84625C9.01706 5.5506 7.9589 4.5 6.65392 4.5C5.34893 4.5 4.29077 5.5506 4.29077 6.84625C4.29077 8.14191 5.34893 9.19251 6.65392 9.19251C7.9589 9.19251 9.01706 8.14191 9.01706 6.84625Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20.2907 16.5533C20.2907 15.2576 19.2334 14.207 17.9284 14.207C16.6226 14.207 15.5645 15.2576 15.5645 16.5533C15.5645 17.8489 16.6226 18.8995 17.9284 18.8995C19.2334 18.8995 20.2907 17.8489 20.2907 16.5533Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="nav-text">PIC</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/kasir/transaksi" className="" aria-expanded="false">
                            <div className="menu-icon">
                                <svg width={25} height={24} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.148 20.417C20.021 20.417 21.54 18.899 21.541 17.026V17.024V14.324C20.304 14.324 19.302 13.322 19.301 12.085C19.301 10.849 20.303 9.846 21.54 9.846H21.541V7.146C21.543 5.272 20.026 3.752 18.153 3.75H18.147H6.43502C4.56102 3.75 3.04202 5.268 3.04102 7.142V7.143V9.933C4.23502 9.891 5.23602 10.825 5.27802 12.019C5.27902 12.041 5.28002 12.063 5.28002 12.085C5.28102 13.32 4.28202 14.322 3.04702 14.324H3.04102V17.024C3.04002 18.897 4.55902 20.417 6.43202 20.417H6.43302H18.148Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.6621 9.06303L13.2781 10.31C13.3381 10.432 13.4541 10.517 13.5891 10.537L14.9661 10.738C15.3071 10.788 15.4421 11.206 15.1961 11.445L14.2001 12.415C14.1021 12.51 14.0581 12.647 14.0801 12.782L14.3151 14.152C14.3731 14.491 14.0181 14.749 13.7141 14.589L12.4831 13.942C12.3621 13.878 12.2181 13.878 12.0971 13.942L10.8671 14.589C10.5621 14.749 10.2071 14.491 10.2651 14.152L10.5001 12.782C10.5231 12.647 10.4781 12.51 10.3801 12.415L9.38511 11.445C9.13911 11.206 9.27411 10.788 9.61411 10.738L10.9911 10.537C11.1261 10.517 11.2431 10.432 11.3031 10.31L11.9181 9.06303C12.0701 8.75503 12.5101 8.75503 12.6621 9.06303Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="nav-text">Kasir</span>
                        </Link>
                    </li>

                    <li className="menu-title">Laporan</li>
                    <li>
                        <a href="#laporan" className="has-arrow " aria-expanded="false">
                            <div className="menu-icon">
                                <svg width={25} height={24} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.5687 13.8887C18.2435 13.8887 18.8098 14.4455 18.7066 15.1118C18.1013 19.0318 14.7456 21.9423 10.6982 21.9423C6.22029 21.9423 2.59082 18.3129 2.59082 13.836C2.59082 10.1476 5.39293 6.71181 8.54766 5.93497C9.22556 5.7676 9.92029 6.24445 9.92029 6.94234C9.92029 11.6708 10.0792 12.8939 10.9771 13.5592C11.875 14.2244 12.9308 13.8887 17.5687 13.8887Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M21.9834 9.95121C22.0371 6.91331 18.3055 2.01647 13.7581 2.10068C13.4045 2.107 13.1213 2.40173 13.1055 2.75437C12.9908 5.25226 13.1455 8.4891 13.2318 9.95647C13.2581 10.4133 13.6171 10.7723 14.0729 10.7986C15.5813 10.8849 18.936 11.0028 21.3981 10.6302C21.7329 10.5796 21.9781 10.2891 21.9834 9.95121Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                            </div>
                            <span className="nav-text">Laporan</span>
                        </a>
                        <ul aria-expanded="false" id="laporan">
                            <li className="mini-dashboard">Laporan</li>
                            <li>
                                <Link href="/admin/penjualan">Laporan Penjualan</Link>
                            </li>
                            <li>
                                <Link href="/admin/labapenjualan">Laporan Laba Penjualan</Link>
                            </li>
                        </ul>
                    </li> */}
                </ul>
                <div className="switch-btn">
                    <Link href="" onClick={tombol} >
                        <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18.36 6.63965C19.6184 7.89844 20.4753 9.50209 20.8223 11.2478C21.1693 12.9936 20.9909 14.803 20.3096 16.4474C19.6284 18.0918 18.4748 19.4972 16.9948 20.486C15.5148 21.4748 13.7749 22.0026 11.995 22.0026C10.2151 22.0026 8.47515 21.4748 6.99517 20.486C5.51519 19.4972 4.36164 18.0918 3.68036 16.4474C2.99909 14.803 2.82069 12.9936 3.16772 11.2478C3.51475 9.50209 4.37162 7.89844 5.63 6.63965"
                                stroke="#252525"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 2V12"
                                stroke="#252525"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="nav-text">Logout</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
