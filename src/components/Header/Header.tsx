import { Box } from '@mui/material';
import {
  HeaderAccount,
  type RootLinkType
} from '@pagopa/mui-italia';

export type HeaderProps = {
  onAssistanceClick?: () => void;
};

export const Header = (props: HeaderProps) => {
  const { onAssistanceClick = () => null } = props;

  const pagopaLink: RootLinkType = {
    label: 'PagoPA S.p.A.',
    href: 'https://www.pagopa.it/',
    ariaLabel: 'Link: vai al sito di PagoPA S.p.A.',
    title: 'Sito di PagoPA S.p.A.'
  };

  return (
    <Box
      sx={{
        '& .MuiStack-root': {
          borderBottom: 'none !important',
        },
      }}
    >
      <HeaderAccount
        enableAssistanceButton={false}
        rootLink={pagopaLink}
        enableLogin={false}
        loggedUser={false}
        onAssistanceClick={onAssistanceClick}
      />
    </Box>
  );
};

export default Header;