import { Box, Typography, Button } from '@mui/material';
import phonePreview from '../../assets/io-app.png';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useMediaQuery } from '@mui/system';

export const IOFeaturesBanner = () => {
  const isMobile = useIsMobile()
  const isTablet = useMediaQuery('(min-width:640px) and (max-width:899px)');

  if (isMobile) {
    return (
      <Box
        width="100%"
        bgcolor="white"
        display="flex"
        justifyContent="center"
        px={3}
        pt={6}
        pb={2}
      >
        <Box
          bgcolor="#EFFBFF"
          borderRadius="16px"
          width="100%"
          maxWidth="400px"
          textAlign="left"
          px={2}
          py={3}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              color="#000"
              mb={1.5}
              sx={{ lineHeight: 1.3 }}
            >
              Scopri le funzionalità di IO
            </Typography>

            <Typography
                variant="body1"
                color="#000"
                mb={8}
                sx={{ lineHeight: 1.5, whiteSpace: 'pre-line' }}
            >
                {`Con IO ricevi comunicazioni dagli enti pubblici, aggiungi i tuoi documenti personali, ottieni bonus e sconti, paghi e firmi in digitale.\nTutto sull’app IO.`}
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#0B3EE3',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '8px',
              fontSize: 14,
              alignSelf: 'flex-start',
              px: 2.5,
              py: 1,
              '&:hover': { backgroundColor: '#0036cc' },
            }}
            href="https://io.italia.it"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scopri di più
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      width="100%"
      bgcolor="white"
      display="flex"
      justifyContent="center"
      px={{ xs: 4, md: 14 }}
      pt={{ xs: 4, md: 6 }}
      pb={2}
    >
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems="stretch"
        justifyContent="space-between"
        bgcolor="#F0F7FF"
        borderRadius={"24px"}
        width="100%"
        maxWidth="1440px"
        px={{ xs: 3, md: 6 }}
        gap={4}
        pt={{ xs: 4, md: 4 }}

      >
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          textAlign={{ xs: 'center', md: 'left' }}
          pb={{ xs: 4, md: 6 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700} mb={2} color="#000">
              Scopri le funzionalità di IO
            </Typography>
            <Typography
                variant="body1"
                color="#000"
                mb={3}
                sx={{ whiteSpace: 'pre-line' }}
            >
                {`Con IO ricevi comunicazioni dagli enti pubblici, aggiungi i tuoi documenti personali, ottieni bonus e sconti, paghi e firmi in digitale.\nTutto sull’app IO.`}
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#0B3EE3',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 1,
              alignSelf: { xs: 'center', md: 'flex-start' },
              '&:hover': { backgroundColor: '#0036cc' },
            }}
            href="https://io.italia.it"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scopri di più
          </Button>
        </Box>

        <Box
          flex="1"
          display="flex"
          justifyContent={isTablet ? "center" : "flex-end"}
          alignItems="flex-end"
          mr={isTablet ? 0 : 4}
        >
          <Box
            component="img"
            src={phonePreview}
            alt="Anteprima App IO"
            sx={{
              maxWidth: '50%',
              height: 'auto',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};