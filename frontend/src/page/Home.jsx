import React from 'react'
import Hide from '../component/Hide.jsx'
import Footer from './Footer.jsx'
import Certificate from '../component/Certificate.jsx'
import Recom from '../component/Recom.jsx'
import Brand from '../component/Brand.jsx'

const Home = () => {
  return (
    <>
      <div>
        <Hide />
      </div>
      <div>
        <Brand/>
      </div>
      <div>
        <Recom />
      </div>
      <div>
        <Certificate />
      </div>
      <Footer />
    </>
  )
}

export default Home







