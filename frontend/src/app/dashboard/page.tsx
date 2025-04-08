import ShipmentCard from '@/components/ShipmentCard'
import React from 'react'

const page = () => {
    return (
        <div className='px-36 py-20'>
            <h1 className='text-4xl'>Overview</h1>
            <h1 className='text-2xl'>Dashboard</h1>

            <div className='flex gap-4 p-4justify-between'>
                <div className='flex-1'><ShipmentCard isProjected units={1232} hours={18.5} uph={67} /></div>
                <div className='flex-1'><ShipmentCard units={1232} hours={18.5} uph={67} /></div>
                <div>
                </div>
            </div>



        </div>
    )
}

export default page