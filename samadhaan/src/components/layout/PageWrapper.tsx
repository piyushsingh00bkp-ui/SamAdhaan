import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  withFooter?: boolean;
  className?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function PageWrapper({ children, withFooter = true, className }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`flex-1 ${className ?? ''}`}
      >
        {children}
      </motion.main>
      {withFooter && <Footer />}
    </div>
  );
}
