import { memo, FC, type ReactNode } from "react";

interface LoadingProps {
  isLoading: boolean;
  children: ReactNode;
}

const Loading: FC<LoadingProps> = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div
        className="
		flex 
		h-full 
		w-full 
		animate-pulse 
		items-center 
		justify-center 
		bg-neutral-500 
		text-2xl 
		font-semibold 
		text-white"
      >
        Loading...
      </div>
    );
  }
  return <>{children}</>;
};

export default memo(Loading);
