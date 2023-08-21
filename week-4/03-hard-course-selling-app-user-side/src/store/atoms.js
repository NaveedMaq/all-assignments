import { atom } from 'recoil';

const isLoggedIn = atom({
  key: 'isLoggedIn',
  default: undefined,
});

const pageTitle = atom({
  key: 'pageTitle',
  default: '',
});

const windowLoading = atom({
  key: 'windowLoading',
  default: false,
});

export default { isLoggedIn, pageTitle, windowLoading };
