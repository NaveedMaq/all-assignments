import { Link } from 'react-router-dom';
function Logo() {
  return (
    <Link to='/'>
      <img src='/coursera.svg' />
    </Link>
  );
}

export default Logo;
