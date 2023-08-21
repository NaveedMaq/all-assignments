import { CircularProgress } from '@mui/material';

function WindowLoader() {
  return (
    <div
      style={{
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        overflow: 'hidden',
        width: '100%',
        position: 'absolute',
        backdropFilter: 'blur(7px)',
        margin: '0',
        padding: '0',
      }}
    >
      <CircularProgress color='inherit' />
    </div>
  );
}

export default WindowLoader;
