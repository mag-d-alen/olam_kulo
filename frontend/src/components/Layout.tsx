import { Outlet } from 'react-router-dom';
import { HeaderNavigation } from '../widgets/HeaderNavigation';
import { Loader } from './Loader';

type LayoutProps = {
  isLoading?: boolean;
};

export const Layout = ({ isLoading = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        <HeaderNavigation />
      </Header>
      <main className="flex-1 pt-16 p-4 min-h-screen">
        {isLoading ? <Loader /> : <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

const Header = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="sticky top-0 z-10 flex justify-end items-center gap-4 bg-gray-500 p-4 w-full shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-4 w-full">{children}</div>
    </header>
  );
};

const Footer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <footer className="flex justify-center items-center bg-gray-500 p-4 w-full">
      {children}
    </footer>
  );
};
