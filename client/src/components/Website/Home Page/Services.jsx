import React from 'react'

const Services = () => {
  return (
    <div className='mb-16'>
      <div className='px-3 py-8 flex flex-col md:flex-row flew-wrap justify-center items-center gap-8'>
        <div className='flex md:w-1/4 flex-col justify-center items-center gap-4 p-4'>
            <img className='w-1/3' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-XGZwfz7-VQR8eBCeEp2iVi8vW5Lev6D1UwVCy8_i5omrjJjo" alt="Search flight" />
            <h1 className='font-bold text-xl lg:text-2xl'>One search, all the flights</h1>
            <p>We help you finds cheap flights on one click</p>
        </div>
        <div className='flex md:w-1/4 flex-col justify-center items-center gap-4 p-4'>
            <img className='w-1/3' src="https://cdn-icons-png.flaticon.com/512/422/422943.png" alt="Customize" />
            <h1 className='font-bold text-xl lg:text-2xl'>Customizable</h1>
            <p>We help you customize your trips according to your preferences</p>
        </div>
        <div className='flex md:w-1/4 flex-col justify-center items-center gap-4 p-4'>
            <img className='w-1/3' src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSjHxdx8Oi2h0W1pjroXEPVsbR_RLc0NdrpviVX95-azW0TA4Jf" alt="Save Time" />
            <h1 className='font-bold text-xl lg:text-2xl'>Travel more, spend less</h1>
            <p>We help you plan budget-friendly trips</p>
        </div>
      </div>
    </div>
  )
}

export default Services
