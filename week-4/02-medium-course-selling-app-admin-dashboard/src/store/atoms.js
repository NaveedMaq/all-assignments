import { atom } from 'recoil';

export const loginAtom = atom({
  key: 'loginAtom',
  default: undefined,
});

export const isLoadingAtom = atom({
  key: 'isLoadingAtom',
  default: true,
});

export const isWindowLoadingAtom = atom({
  key: 'isWindowLoadingAtom',
  default: false,
});

export const pageTitleAtom = atom({
  key: 'pageTitleAtom',
  default: 'Home',
});
