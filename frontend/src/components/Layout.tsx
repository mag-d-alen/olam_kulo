import { Header } from '../widgets/Header';

type LayoutProps = {
  children: React.ReactNode;
  isLoading?: boolean;
};
export const Layout = ({ children, isLoading = false }: LayoutProps) => {
  return (
    <>
      <Header />
      {isLoading ? <div>Loading...</div> : children}
      <Footer />
    </>
  );
};
const Footer = () => {
  return (
    <footer className='flex justify-center items-center bg-gray-500 p-4 w-full'>
      <p>Footer</p>
    </footer>
  );
};
