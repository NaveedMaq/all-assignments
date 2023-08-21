import { Link } from 'react-router-dom';

function Button({
  children,
  variant = 'Button',
  to = '/',
  size = 'medium',
  backgroundColor = '#1971c2',
  color = '#fff',
  onClick,
}) {
  let masterSize;

  if (size === 'large') masterSize = 2;
  if (size === 'medium') masterSize = 1.4;
  if (size === 'small') masterSize = 0.8;

  const style = {
    cursor: 'pointer',
    backgroundColor,
    color,
    maxWidth: 'fit-content',
    fontSize: size === 'small' ? '10px' : `${masterSize}rem`,
    padding: `${masterSize / 2}rem ${masterSize}rem`,
    borderRadius: `${masterSize * 2}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    textDecoration: 'none',
  };

  if (variant === 'Button') {
    return (
      <div style={style} onClick={onClick}>
        {children}
      </div>
    );
  }

  if (variant === 'Link') {
    return (
      <Link style={style} to={to}>
        {children}
      </Link>
    );
  }
}

export default Button;
