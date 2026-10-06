import { Box, Typography } from '@mui/material';
import googlePlay from '../../assets/PlayStore_Button.png';
import appStore from '../../assets/AppStore_Button.png';
import ioGradient from '../../assets/io-gradient-blu.png';
import { useIsMobile } from '../../hooks/useIsMobile';

export const IOBanner = () => {
  const isMobile = useIsMobile();
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ xs: 3, md: 8 }}
      py={{ xs: 4, md: 10 }}
      sx={{
        backgroundColor: '#031344',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={ioGradient}
        alt="gradient"
        sx={{
          position: 'absolute',
          top: isMobile ? null : 0,
          right: isMobile ? null : 0,
          width: 'auto',
          height: '100%',
          objectFit: 'contain',
          opacity: 1,
          mixBlendMode: 'plus-lighter',
          pointerEvents: 'none',
        }}
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={{ xs: 2, md: 4 }}
        flexWrap="wrap"
        sx={{ position: 'relative', zIndex: 1, flexDirection: isMobile ? "column" : "" }}
      >
        <Typography
          variant="h6"
          color="white"
          fontWeight={600}
          sx={{
            minWidth: 'fit-content',
            textAlign: 'left',
          }}
        >
          Scarica IO, è gratis
        </Typography>

        <Box display="flex" gap={isMobile ? 1 : 2} flexWrap="wrap" sx={{ flexDirection: isMobile ? "column" : "" }}>
            <Box
              component="a"
              href="https://play.google.com/store/apps/details?id=it.pagopa.io.app"
              target="_blank"
              rel="noopener noreferrer"
              sx={{display: "flex", alignItems: "center"}}
            >
              <Box component="img" src={googlePlay} alt="Google Play" sx={{ height: 48 }} />
            </Box>

            <Box
              component="a"
              href="https://apps.apple.com/it/app/io/id1501681835"
              target="_blank"
              rel="noopener noreferrer"
              sx={{display: "flex", alignItems: "center"}}
            >
              <Box component="img" src={appStore} alt="App Store" sx={{ height: 48 }} />
            </Box>
        </Box>
      </Box>
    </Box>
  );
};