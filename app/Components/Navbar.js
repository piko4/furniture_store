"use client"
import Link from 'next/link'
import Footer from './Footer'
import { useState } from 'react';
import App from 'next/app';
import { useSession, signIn, signOut } from "next-auth/react"

import bestsellers from '../Pages/BestSellers/page';
import { redirect } from 'next/navigation';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);

    const { data: session } = useSession()

    return (
        <div>


            <nav className="bg-white dark:bg-gray-800 antialiased">
                <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
                    <div className="flex items-center justify-between">
                        {/* logo */}
                        <div className="shrink-0">
                            <a href="#" title="" className="">
                                <img className="block w-auto h-8 dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full.svg" alt="" />
                                <img className="hidden w-auto h-8 dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full-dark.svg" alt="" />
                            </a>
                        </div>

                        {/* navbar links */}
                        <div className=" flex items-center space-x-8">
                            <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
                                <li>
                                    <Link href='/' title="" className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                        Home
                                    </Link>
                                </li>
                                <li className="shrink-0">
                                    <Link href='/Pages/BestSellers' title="" className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                        Best Sellers
                                    </Link>
                                </li>
                                <li className="shrink-0">
                                    <Link href='/Pages/Community' title="" className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                        Community
                                    </Link>
                                </li>
                                <li className="shrink-0">
                                    <Link href='/Pages/AboutUs' title="" className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                        About Us
                                    </Link>
                                </li>
                                <li className="shrink-0">
                                    <Link href='/Pages/Contact' title="" className="text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* account button/dropdown */}
                        <div className={'flex items-center lg:space-x-2'}>

                            {session &&
                                <>
                                    {/* Cart button */}
                                    <Link href='/Pages/my_cart' id="myCartDropdownButton1" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                                        <span className="sr-only">
                                            Cart
                                        </span>
                                        <svg className="w-5 h-5 lg:me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                                        </svg>
                                        <span className="hidden sm:flex">My Cart</span>
                                        {/* <svg className="hidden sm:flex w-4 h-4 text-gray-900 dark:text-white ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                                </svg> */}
                                    </Link>

                                    {/* cart dropdown */}
                                    {/* deprecated */}

                                    {/* ----------------Account button------------------ */}
                                    <button onMouseOver={() => setIsVisible(true)} id="userDropdownButton1" data-dropdown-toggle="userDropdown1" type="button" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
                                        <svg className="w-5 h-5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-width="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        Account
                                        <svg className="w-4 h-4 text-gray-900 dark:text-white ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                                        </svg>
                                    </button>
                                </>
                            }

                            {!session &&
                                <>
                                    {/* Login button */}
                                    <Link rel="stylesheet" href="/Pages/Login" className=' text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2 me-2 my-[1px] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>Login </Link>

                                </>
                            }
                            {/* -----------------Account dropdown----------------- */}
                            <div onMouseLeave={() => setIsVisible(false)} id="userDropdown1" className={isVisible ? 'absolute right-2 top-16 z-10 w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white antialiased shadow dark:divide-gray-600 dark:bg-gray-700' : 'hidden'} >
                                <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                                    <li><Link href="/Pages/MyAccount" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> My Account </Link></li>
                                    <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> My Orders </a></li>
                                    <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Settings </a></li>
                                    <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Favourites </a></li>
                                    <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Delivery Addresses </a></li>
                                    <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Billing Data </a></li>
                                </ul>
                                {/* Logout */}
                                <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    <button onClick={() => signOut({callbackUrl:'/'})} title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-red-500  " > Log Out </button>
                                </div>
                            </div>

                            {/* responsiv button */}
                            <button type="button" data-collapse-toggle="ecommerce-navbar-menu-1" aria-controls="ecommerce-navbar-menu-1" aria-expanded="false" className="inline-flex lg:hidden items-center justify-center hover:bg-gray-100 rounded-md dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white">
                                <span className="sr-only">
                                    Open Menu
                                </span>
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14" />
                                </svg>
                            </button>
                        </div>

                    </div>

                    {/* responsiv Navbar links */}
                    <div id="ecommerce-navbar-menu-1" className="bg-gray-50 dark:bg-gray-700 dark:border-gray-600 border border-gray-200 rounded-lg py-3 hidden px-4 mt-4">
                        <ul className="text-gray-900 dark:text-white text-sm font-medium dark:text-white space-y-3">
                            <li>
                                <Link href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Home</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Best Sellers</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Gift Ideas</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Games</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Electronics</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary-700 dark:hover:text-primary-500">Home & Garden</Link>
                            </li>
                        </ul>
                    </div>
                </div>

            </nav >

            {/* category navbar */}
            <nav nav className=' border-gray-200 bg-gray-700' >
                <div className='flex py-2 px-4: justify-center'>
                    <Link className=' py-2 px-4  text-white' href='/Pages/Products/Sofas' >Sofas</Link>
                    <Link className=' py-2 px-4 text-white' href='/Pages/Products/Foldables' >Foldables</Link>
                    <Link className=' py-2 px-4  text-white' href='/Pages/Products/Tables' >Tables</Link>
                    <Link className=' py-2 px-4  text-white' href='/Pages/Products/Bedroom' >Bedroom</Link>
                    <Link className=' py-2 px-4  text-white' href='/Pages/Products/Kitchen' >Kitchen</Link>
                    <Link className=' py-2 px-4  text-white' href='/Pages/Products/Office' >Office</Link>
                    <Link className=' py-2 px-4  text-white' href='/Pages/Products/Wallpapers' >Wallpapers</Link>
                    <Link className=' py-2 px-4  text-white' href='/Pages/Products/Lightings' >Lightings</Link>
                    <Link className=' py-2 px-4  text-white' href='/Pages/Products/floor' >Floor</Link>

                </div>
            </nav>


        </div >
    )


}

export default Navbar
