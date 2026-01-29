export const Loader = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className={`py-2 text-2xl flex items-center justify-center w-full z-[1010] bg-white/50 backdrop-blur-sm rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
      <span className="animate-spin rounded-full h-8 w-8 ">🌎</span>
      <span className="ml-2">{text}</span>
    </div>
  );
};
