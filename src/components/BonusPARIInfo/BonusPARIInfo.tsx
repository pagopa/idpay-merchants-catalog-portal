import { appConfig } from "../../config/app";
import { Box, Typography } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import pariLogo from '../../assets/PARI.png';
export const BonusPariInfo = () => {
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            textAlign={'center'}
            py={4}
            px={2}
            bgcolor={theme.palette.primary.contrastText}
        >
            <Box
                width={'80%'}
                borderTop={`1px solid ${theme.palette.divider}`}
                mb={3}
            />

            <Typography
                variant='body1'
                fontWeight={600}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                }}
            >
                {appConfig.copy.realizationPrefix}{' '}
                <Box
                    component="img"
                    src={pariLogo}
                    alt="Logo PARI"
                    height={24}
                    width="auto"
                    sx={{
                        verticalAlign: 'middle',
                    }}
                />
            </Typography>

            <Typography
                variant="body2"
                fontWeight={400}
                color="#636B82"
                sx={{ mt: 1 }}
            >
                <a href="https://developer.pagopa.it/pari/overview" target="_blank" rel='noopener'>PARI</a> è la piattaforma digitale che semplifica l’accesso a bonus e incentivi pubblici.
                <br />
                La piattaforma permette di gestire tutti gli incentivi in un unico posto e di utilizzarli
                tramite l’app IO e presso i
                <br />
                commercianti convenzionati.
            </Typography>
        </Box>
    );
};
