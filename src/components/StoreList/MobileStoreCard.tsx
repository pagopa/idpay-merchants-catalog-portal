import { Card, CardContent, Typography, Box } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { ButtonNaked, theme } from '@pagopa/mui-italia'
import type { Store } from './StoreList'
import { getStoreField } from './storeFields'
import { appConfig } from '../../config/app'

interface MobileStoreCardProps {
  store: Store
  isOnline: boolean
  onClick?: () => void
}

const MobileStoreCard = ({ store, isOnline, onClick }: MobileStoreCardProps) => {
  const columns = isOnline ? appConfig.tableColumns.online : appConfig.tableColumns.physical;

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
        {columns.filter(col => col.key !== 'actions').map((col, index) => (
          <Typography key={col.key} variant={index === 0 ? 'subtitle2' : 'body2'}
            sx={{ fontWeight: index === 0 ? 700 : 500, color: theme.palette.text.primary, mb: 0.8, overflowWrap: 'anywhere' }}>
            {getStoreField(store, col.key) || '-'}
          </Typography>
        ))}

        {columns.some(col => col.key === 'actions') && <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
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
        </Box>}
      </CardContent>
    </Card>
  )
}

export default MobileStoreCard