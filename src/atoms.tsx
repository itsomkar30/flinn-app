import { atom } from 'jotai'
import { Group } from './types'

export const selectedClanAtom = atom<Group | null>(null)