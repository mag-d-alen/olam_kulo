import { HeaderNavigation } from '../widgets/HeaderNavigation';
import { Loader } from './Loader';

type LayoutProps = {
  children: React.ReactNode;
  isLoading?: boolean;
};

export const Layout = ({ children, isLoading = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        <HeaderNavigation />
      </Header>
      <main className="flex-1 pt-16 p-4 min-h-screen">
        {isLoading ? <Loader /> : children}
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
