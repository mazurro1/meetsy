import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "@/components/redux/store";
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
