import Link from 'next/link'
import React from 'react'
import { Grid2X2, User, ChartColumnBig, History, Grid } from 'lucide-react'

const Sidebar = () => {

    return (
        <div className='w-[5%] bg-black flex flex-col items-center justify-items-between p-3 text-white'>
            <div className='text-white h-1/2 flex flex-col justify-items-center items-center'>
                <Link href='/' className='my-4'>Freyt</Link>
                {/* Dashboard */}
                <Link href='/dashboard' className='my-4'><Grid2X2 /></Link>
                {/* Roster */}
                <Link href='/' className='my-4'><User /></Link>
                {/* Store Performance */}
                <Link href='/' className='my-4'><ChartColumnBig /></Link>
                {/* Shipment History */}
                <Link href='/' className='my-4'><History /></Link>
            </div>

        </div>
    )
}

export default Sidebar