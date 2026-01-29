export const Loader = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className={`text-2xl flex items-center sticky top-0 justify-center w-screen h-[100%] z-[1005] bg-white/50 backdrop-blur-sm`}>
      <span className="animate-spin rounded-full">🌎</span>
      <span className="ml-2">{text}</span>
    </div>
  );
};
