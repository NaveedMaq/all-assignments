import { atom } from 'recoil';

export const loginAtom = atom({
  key: 'loginAtom',
  default: false,
});

export const isLoadingAtom = atom({
  key: 'isLoadingAtom',
  default: true,
});
