"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import Swal from 'sweetalert2';

const Buttonlogout = () => {

    function tombol() {
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


    return (
        <a type='button' onClick={tombol}>
            <span>Logout</span>
        </a>
    )
}

export default Buttonlogout