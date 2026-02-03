import { RootState } from "..";

export const loadingCntSelector = (state: RootState) =>
  state.LodingSlice.loadingCount > 0;
