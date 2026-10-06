import { Box } from '@mui/material';
import Header from '../Header/Header';
import { Footer } from '../Footer/Footer';

type LayoutProps = {
  children: React.ReactNode;
  hasSubHeader?: boolean;
  hasPadding?: boolean;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      gridTemplateRows="auto 1fr auto"
      gridTemplateAreas={`"header"
                          "body"
                          "footer"`}
      minHeight="100vh"
    >
      <Box component="header" gridArea="header">
        <Header />
      </Box>

      <Box
        component="main"
        gridArea="body"
        overflow="auto"
        p={0}
      >
        {children}
      </Box>

      <Box gridArea="footer" id="footerBox">
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;