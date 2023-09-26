import { atom } from "jotai";
import type Position from "@/types/Position";
export const locationAtom = atom<Position | null>(null);
