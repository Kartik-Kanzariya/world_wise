import React from 'react'
import styles from './PageNav.module.css'
import {NavLink} from 'react-router-dom'
import Logo from './Logo'
// import {nav} from './PageNav.module.css'  destructure

export default function PageNav() {
  return (
//    <nav className={nav}>
   <nav className={styles.nav}>
    <Logo/>
        <ul>
           
            <li>
                <NavLink to='/pricing'>Pricing</NavLink>
            </li>
            <li>
                <NavLink to='/product'>Product</NavLink>
            </li>
            <li>
                <NavLink to='/login' className={styles.ctaLink}>Login</NavLink>
            </li>
        </ul>
   </nav>
  )
}
