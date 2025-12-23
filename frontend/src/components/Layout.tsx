import { Header } from '../widgets/Header';
import { Loader } from './Loader';

type LayoutProps = {
  children: React.ReactNode;
  isLoading?: boolean;
};
export const Layout = ({ children, isLoading = false }: LayoutProps) => {
  return (
    <>
      <Header />
      {isLoading ? <Loader /> : children}
      <Footer />
    </>
  );
};
const Footer = () => {
  return (
    <footer className="flex justify-center items-center bg-gray-500 p-4 w-full">
      <p>Footer</p>
    </footer>
  );
};
