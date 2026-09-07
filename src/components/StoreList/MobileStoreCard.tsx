import { Card, CardContent, Typography, Box } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { ButtonNaked, theme } from '@pagopa/mui-italia'
import type { Store, PhysicalStore, OnlineStore } from './StoreList'

interface MobileStoreCardProps {
  store: Store
  isOnline: boolean
  onClick?: () => void
}

const MobileStoreCard = ({ store, isOnline, onClick }: MobileStoreCardProps) => {
  const getAddressString = (s: PhysicalStore) => {
    const parts = [
      s.address,
      s.streetNumber,
      s.zipCode,
      s.city,
      s.province,
    ].filter(Boolean)
    return parts.join(', ')
  }

  return (
    <Card
      elevation={0}
      sx={{
        mt: isOnline ? 2 : 1,
        borderRadius: '8px',
        boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        pb: 0
      }}
    >
      <CardContent sx={{ px: 2.5, pt: 2, pb: 0, '&:last-child': { pb: 1 }, }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 0.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {store.franchiseName}
        </Typography>

        {!isOnline ? (
          <Typography
            variant="body2"
            sx={{
              color: '#374151',
              fontWeight: 500,
              mb: 0.8,
              lineHeight: 1.4,
            }}
          >
            {getAddressString(store as PhysicalStore)}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: '#374151',
              fontWeight: 500,
              mb: 0.8,
              lineHeight: 1.4,
            }}
          >
            {(store as OnlineStore).website || '-'}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <ButtonNaked
            variant="text"
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
            onClick={onClick}
            sx={{
              textTransform: 'none',
              color: '#0B3EE3',
              fontWeight: 700,
              fontSize: 14,
              px: 0,
              '& .MuiButton-endIcon': {
                ml: 0.5,
              },
            }}
          >
            Mostra dettagli
          </ButtonNaked>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MobileStoreCard