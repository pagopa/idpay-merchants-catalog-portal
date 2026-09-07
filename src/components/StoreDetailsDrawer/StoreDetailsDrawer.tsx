import React, { useEffect, useState } from 'react'
import {
  Box, Typography, IconButton, Drawer, SwipeableDrawer, Button, Link,
  Divider,
  Alert,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { CopyToClipboardButton, theme } from '@pagopa/mui-italia'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { Store, PhysicalStore, OnlineStore } from '../StoreList/StoreList'
import PlaceIcon from '@mui/icons-material/Place'
import LanguageIcon from '@mui/icons-material/Language'
import PhoneIcon from '@mui/icons-material/Phone'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

type Props = {
  open: boolean
  onClose: () => void
  onOpen?: () => void
  store: Store | null
  width?: number | string
  mobileHeight?: number | string
  forceMode?: 'drawer' | 'swipeable'
}

export const StoreDetailsDrawer: React.FC<Props> = ({
  open, onClose, onOpen, store, width = 420, mobileHeight = '85%', forceMode,
}) => {
  const isMobile = useIsMobile()
  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent)
  const [isCopied, setIsCopied] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);


  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    if (isCopied) {
      setFadeOut(false);

      fadeTimer = setTimeout(() => setFadeOut(true), 2000);
      hideTimer = setTimeout(() => {
        setIsCopied(false);
        setFadeOut(false);
      }, 2500);
    } else {
      setFadeOut(false);
      setIsCopied(false)
    }

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [isCopied]);

  useEffect(() => {
    setIsCopied(false);
  }, [open]);

  const isPhysicalStore = (s: Store | null): s is PhysicalStore => {
    return s !== null && s.type === 'PHYSICAL'
  }

  const isOnlineStore = (s: Store | null): s is OnlineStore => {
    return s !== null && s.type === 'ONLINE'
  }

  const handleCopyAllInfo = () => {
    setIsCopied(true);
    let infoText = `${store?.franchiseName}\n\n`;

    if (physicalStore) {
      infoText += `Indirizzo:\n${physicalStore.address}${physicalStore.streetNumber ? `, ${physicalStore.streetNumber}` : ''}\n${physicalStore.zipCode} ${physicalStore.city} (${physicalStore.province})\n${physicalStore.region}\n\n`;

      if (physicalStore.channelPhone) {
        infoText += `Telefono: ${physicalStore.channelPhone}\n`;
      }
      if (physicalStore.website) {
        infoText += `Sito web: ${physicalStore.website}\n`;
      }
    }

    if (onlineStore) {
      if (onlineStore.website) {
        infoText += `Sito web: ${onlineStore.website}\n`;
      }
    }

    navigator.clipboard.writeText(infoText);
  };

  const getNavigationUrl = (store: PhysicalStore): string => {
    const address = `${store.address}${store.streetNumber ? `, ${store.streetNumber}` : ''}, ${store.zipCode} ${store.city} ${store.province} ${store.franchiseName}`;

    if (isAndroid) {
      return `geo:0,0?q=${encodeURIComponent(address)}`;
    } else {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
  };

  const physicalStore = isPhysicalStore(store) ? store : null
  const onlineStore = isOnlineStore(store) ? store : null

  const hasContacts = !!(physicalStore?.channelPhone || store?.website)

  const Header = (
    <Box position="relative" mb={2} p={2}>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          color: theme.palette.action.active,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography
        variant="h6"
        fontWeight={700}
        fontStyle="bold"
        mt={4}
      >
        {store?.franchiseName || '-'}
      </Typography>

      {physicalStore && (
        <Box mt={3}>
          <Typography variant="body2" fontWeight={600} fontSize={'semibold'} sx={{ color: theme.palette.action.active, mb: 0.5 }}>
            Indirizzo
          </Typography>
          <Box mt={2} display="flex" alignItems="center" gap={1}>
            <Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
              <PlaceIcon sx={{ fontSize: 20, mr: 0.5, flexShrink: 0 }} />
              <Typography
                variant='body2'
                fontWeight={700}
                sx={{ wordBreak: 'break-word' }}
              >
                {`${physicalStore.address}${physicalStore.streetNumber ? `, ${physicalStore.streetNumber}` : ''}, ${physicalStore.zipCode} ${physicalStore.city} ${physicalStore.province}`}
              </Typography>
            </Box>
            <CopyToClipboardButton
              value={`${physicalStore.address}${physicalStore.streetNumber ? `, ${physicalStore.streetNumber}` : ''}, ${physicalStore.zipCode} ${physicalStore.city} ${physicalStore.province}`}
            />
          </Box>
        </Box>
      )}
    </Box>
  )

  const Content = store ? (
    <Box px={3} pb={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {hasContacts && (
          <>
            <Typography variant="body2" fontWeight={600} fontSize={'semibold'} sx={{ color: theme.palette.action.active, mb: 2 }}>
              Contatti
            </Typography>

            {physicalStore?.channelPhone && (
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon sx={{ fontSize: 20, color: '#0B3EE3' }} />
                <Link
                  href={`tel:${physicalStore.channelPhone}`}
                  underline="hover"
                  sx={{
                    color: '#0B3EE3',
                    fontWeight: 700,
                    fontSize: '16px'
                  }}
                >
                  {physicalStore.channelPhone}
                </Link>
              </Box>
            )}
            {physicalStore?.channelPhone && <Divider sx={{ my: 1 }} />}

            {store.website && (
              <Box display="flex" alignItems="center" gap={1}>
                <LanguageIcon sx={{ fontSize: 20, color: '#0B3EE3' }} />
                <Link
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    color: '#0B3EE3',
                    fontWeight: 700,
                    fontSize: '16px'
                  }}
                >
                  {store.website}
                </Link>
              </Box>
            )}
          </>
        )}
      </Box>

      {isCopied && (
        <Alert
          severity="success"
          variant="outlined"
          sx={{
            mt: 2,
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        >
          Elemento copiato.
        </Alert>
      )}
      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #E5E7EB' }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleCopyAllInfo}
          sx={{
            mb: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              backgroundColor: 'rgba(11, 62, 227, 0.04)',
            },
          }}
        >
          Copia informazioni
        </Button>

        <Button
          variant="contained"
          fullWidth
          endIcon={<OpenInNewIcon />}
          onClick={() => {
            if (onlineStore?.website) {
              window.open(onlineStore.website, '_blank')
            } else if (physicalStore) {
              window.open(getNavigationUrl(physicalStore), '_blank')
            }
          }}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {physicalStore ? 'Ottieni indicazioni' : 'Vai al sito'}
        </Button>
      </Box>
    </Box>
  ) : null

  if (forceMode === 'drawer' || (!isMobile && forceMode !== 'swipeable')) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{ paper: { sx: { width, maxWidth: '100vw', overflowX: 'hidden', wordBreak: 'break-word' } } }}
      >
        {Header}
        {Content}
      </Drawer>
    )
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen ?? (() => { })}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      slotProps={{
        paper: {
          sx: {
            height: mobileHeight,
            width: '100%',
            maxHeight: '100%',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            wordBreak: 'break-word',
          },
        },
      }}
    >
      {Header}
      {Content}
    </SwipeableDrawer>
  )
}