import { CircularProgress } from '@mui/material';
function Loader() {
  return (
    <div
      style={{
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress color='inherit' />
    </div>
  );
}

export default Loader;
