export const Footer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <footer className="flex justify-center items-center bg-gray-500 p-4 w-full">
      {children}
    </footer>
  );
};
