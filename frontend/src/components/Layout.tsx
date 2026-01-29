import { Outlet } from 'react-router-dom';
import { HeaderNavigation } from '../widgets/HeaderNavigation';
import { Loader } from './Loader';

type LayoutProps = {
  isLoading?: boolean;
};

export const Layout = ({ isLoading = false }: LayoutProps) => {
  return (
    < >
      <Header>
        <HeaderNavigation />
      </Header>
      <Main isLoading={isLoading} />
      <Footer />
    </>
  );
};


const Header = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="fixed flex items-center top-0 z-[1005] w-full h-fit min-h-header bg-bg-surface text-text-default border-b border-border-default ">
      <div className="flex items-center p-4 gap-4">{children}</div>
    </header>
  );
};

const Main = ({ isLoading = false }: { isLoading?: boolean, children?: React.ReactNode }) => {
  return (
    <main className="mt-[10vh] flex-1 p-4 min-h-screen w-[100%] overflow-x-hidden overflow-y-auto flex flex-col items-center  px-4 md:px-8">
      {isLoading ? <Loader /> : <Outlet />}
    </main>


  );
};

const Footer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <footer className="fixed bottom-0 z-[1005] flex justify-center items-center bg-bg-surface text-text-on-dark w-full h-footer border-t border-border-default ">
      {children}
    </footer>
  );
};
