import React, { useEffect } from 'react'
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit'

const Footer = () => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');

    // Set the source of the script to the Zendesk snippet URL
    script.src = "https://static.zdassets.com/ekr/snippet.js?key=7392272e-1043-48fc-95fb-aba18ccb1bb9";
    script.id = "ze-snippet";
    // Append the script element to the body of the document
    document.body.appendChild(script);

    // Remove the script element when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="footer">

      <p>© 2023 — All right Reserved@PSYCUBE</p>
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