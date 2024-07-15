import React from 'react'
import Banner from '../common/Banner'
import Boxes from '../common/Boxes'
import AboutUs from '../common/AboutUs'
import Department from '../common/Department'
import Services from '../common/Services'
import CTA from '../common/Cta'

/**
 * Functional component representing the home page.
 * Renders various sections like Banner, Boxes, AboutUs, Department, Services, and CTA.
 */
function Home() {
  return (
    <div>
      <Banner/>
      <Boxes/>
      <AboutUs/>
      {/* <Department/> */}
      {/* <Services/> */}
      <CTA/>
    </div>
  )
}

export default Home
