import React from 'react'
import './Navbar.css'
import MenuIcon from '@mui/icons-material/Menu';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

const Navbar = () => {
    return (
        <div className='Navbar'>
            <div className='right_bar'>
                <MenuIcon fontSize='large' />
                <p>HELLO, HATIM</p>
            </div>
            <PermIdentityIcon />
        </div>
    )
}

export default Navbar