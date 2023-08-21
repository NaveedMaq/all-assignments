import { useEffect } from 'react';
import { pageTitleAtom } from '../store/atoms';
import { useSetRecoilState } from 'recoil';

function PageNotFound() {
  const setPageTitle = useSetRecoilState(pageTitleAtom);

  useEffect(() => {
    setPageTitle('Page Not Found');
  }, [setPageTitle]);
  return <h1>404 Not Found</h1>;
}

export default PageNotFound;
