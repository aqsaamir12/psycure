import React from 'react'
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit'


const Footer = () => {
  return (
    <div className="footer-dash">

      <p>© 2023 — All right Reserved@CureHotline</p>
      <div className="social">
        <MDBBtn className='social-logo' style={{ backgroundColor: '#222831', borderColor: 'transparent' }} href='https://www.facebook.com/login.php'>
          <MDBIcon fab icon='facebook-f' />
        </MDBBtn>

        <MDBBtn className='social-logo' style={{ backgroundColor: '#222831', borderColor: 'transparent' }} href='https://twitter.com/'>
          <MDBIcon fab icon='twitter' />
        </MDBBtn>

        <MDBBtn className='social-logo' style={{ backgroundColor: '#222831', borderColor: 'transparent' }} href='https://www.instagram.com/'>
          <MDBIcon fab icon='instagram' />
        </MDBBtn>

        <MDBBtn className='social-logo' style={{ backgroundColor: '#222831', borderColor: 'transparent' }} href='https://www.youtube.com/'>
          <MDBIcon fab icon='youtube' />
        </MDBBtn>

      </div>
    </div>
  )
}

export default Footer