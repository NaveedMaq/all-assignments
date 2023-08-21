import { CircularProgress } from '@mui/material';
import { useRecoilState } from 'recoil';
import atoms from '../../store/atoms';

function WindowLoader() {
  // GLOBAL STATE
  const [windowLoading] = useRecoilState(atoms.windowLoading);
  return (
    <>
      {windowLoading ? (
        <div
          style={{
            height: '80vh',
            width: '99%',
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default WindowLoader;
