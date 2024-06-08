import React from 'react'
import { useSession } from 'next-auth/react'

export default function Header() {
    const session = useSession()
    return (
        <div>
            <div className="nav-header">
                <a href="/" className="brand-logo">
                    <img alt="" width="55" height="55" className="logo-abbr" src="/tema/images/lgo.png" />
                    <img alt="" width="220" height="51" className="brand-title" src="/tema/images/tulisan.png" />
                </a>
                <div className="nav-control">
                    <div className="hamburger">
                        <span className="line" />
                        <span className="line" />
                        <span className="line" />
                    </div>
                </div>
            </div>

            <div className="header">
                <div className="header-content">
                    <nav className="navbar navbar-expand">
                        <div className="collapse navbar-collapse justify-content-between">
                            <div className="header-left">
                                <h3 className='pt-2 px-3'>Selamat Datang... <a style={{ fontWeight: 'bold', color: 'red' }}>
                                    {session.data?.nama}
                                </a>!</h3>
                            </div>
                            <ul className="navbar-nav header-right">

                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}
