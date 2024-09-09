"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Product from '@/app/Components/Product';

const page = () => {

    return (
       <>
        <Product category={"sofa"}/>
       </>
    )
}

export default page
