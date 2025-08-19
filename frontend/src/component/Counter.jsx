// import React, { useState } from 'react'
// import { PlusIcon } from '@heroicons/react/24/solid'
// import { MinusIcon } from '@heroicons/react/24/solid'


// const Counter = () => {
//      const [count,setCount]=useState(0);
//     const  handleAdd=(()=>{
//         setCount(count+1);
//      })

//      const handleSub=(()=>{
//         setCount(count-1);
//      })
//   return (
//     <>
//     <div className='flex flex-row space-x-4 border rounded-2xl justify-center items-center p-2'>
//     {/* <button className='border bg-green-700 text-white rounded p-2' onClick={handleAdd}>ADD NUMBER</button> */}
//      <MinusIcon className='bg-red-700 h-8 w-8 text-white p-2 cursor-pointer' onClick={handleSub}/>
//     <p>{count}</p>
//     <PlusIcon className=' bg-green-700 h-8 w-8 text-white  p-2 cursor-pointer' onClick={handleAdd}/>
  
//     {/* <button className='border bg-red-700 text-white rounded p-2' onClick={handleSub}>SUB NUMBER</button> */}
//      </div >

//      {/* <PlusIcon className="h-6 w-6 text-black" /> */}
//     </>
//   )
// }

// export default Counter


// components/Counter.jsx
import React from 'react';

const Counter = ({ quantity, setQuantity }) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        className="px-3 py-1 bg-gray-200 rounded"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
      >
        -
      </button>
      <span className="text-lg">{quantity}</span>
      <button
        className="px-3 py-1 bg-gray-200 rounded"
        onClick={() => setQuantity(quantity + 1)}
      >
        +
      </button>
    </div>
  );
};

export default Counter;
