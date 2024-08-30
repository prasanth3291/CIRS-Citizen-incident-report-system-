
import "./Header.css"
function Header() {
  return (
      <div className='header'>
        <div className='emblem'>
          <img src={process.env.PUBLIC_URL + '/assets/images/emblem2.webp'} alt="" />
        </div>
        <div className='title'>
          <h1>CIRS</h1>
        </div>
        <div className='name'>
          <h6>Citizen Incident <br /> Report System</h6>
        </div>
      </div> 
  );
}
export default Header;
