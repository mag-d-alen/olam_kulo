import { Outlet } from 'react-router-dom';
import { HeaderNavigation } from '../widgets/HeaderNavigation';
import { Loader } from './Loader';

type LayoutProps = {
  isLoading?: boolean;
};

export const Layout = ({ isLoading = false }: LayoutProps) => {
  return (
    <>
      <Header>
        <HeaderNavigation />
      </Header>
      <main className="flex-1 p-4 min-h-screen fixed top-20 left-0 right-0 bottom-0">
        {isLoading ? <Loader /> : <Outlet />}
      </main>
      <Footer />
    </>
  );
};

const Header = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="sticky top-0 z-10 gap-4 bg-gray-500 p-4 w-full h-fit ">
      <div className="flex items-center  gap-4 w-full">{children}</div>
    </header>
  );
};

const Footer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <footer className="fixed bottom-0 z-10 flex justify-center items-center bg-gray-500 p-4 w-full h-12">
      {children}
    </footer>
  );
};
