import { atom } from 'jotai';
import { Tables } from './types/database.types';

type Group = Tables<"groups">

export const selectedClanAtom = atom<Group | null>(null);