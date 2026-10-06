import { Box, Skeleton, Card, CardContent } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';

const StoreListSkeleton = () => {
  const isMobile = useIsMobile();
  const skeletonRows = 8;

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          px: { xs: 2, md: 8 },
          pt: 1.5,
          pb: 3,
        }}
      >
        {isMobile ? (
          <Skeleton 
            variant="rounded" 
            width={360} 
            height={38}
            sx={{ maxWidth: '100%' }}
          />
        ) : (
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton variant="text" width="50%" height={40} />
          </Box>
        )}
      </Box>

      {!isMobile && (
        <Box sx={{ px: 8, py: 2.5, backgroundColor: '#F9FAFB' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Skeleton variant="rounded" width="23%" height={56} />
            <Skeleton variant="rounded" width="23%" height={56} />
            <Skeleton variant="rounded" width="23%" height={56} />
            <Skeleton variant="rounded" width="23%" height={56} />
          </Box>
        </Box>
      )}

      <Box sx={{ px: { xs: 2, md: 8 } }}>
        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <Card
                key={i}
                elevation={0}
                sx={{
                  borderRadius: '8px',
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
                  border: '1px solid #E5E7EB',
                }}
              >
                <CardContent sx={{ px: 2.5, pt: 2, pb: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="90%" height={20} sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" width="70%" height={20} />
                  <Skeleton variant="text" width={120} height={20} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                px: 3,
                py: 1.5,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <Skeleton variant="text" width="33%" height={24} />
              <Skeleton variant="text" width="34%" height={24} />
              <Skeleton variant="text" width="26%" height={24} />
              <Box width="7%" />
            </Box>

            {Array.from({ length: skeletonRows }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  gap: 3,
                  px: 3,
                  py: 1.5,
                  borderBottom: '2px solid #E3E7EB',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Skeleton variant="text" width="33%" height={20} />
                <Skeleton variant="text" width="34%" height={20} />
                <Skeleton variant="text" width="26%" height={20} />
                <Box width="7%" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Skeleton variant="circular" width={28} height={28} />
                </Box>
              </Box>
            ))}
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Skeleton variant="rounded" width={200} height={32} />
        </Box>
      </Box>
    </Box>
  );
};

export default StoreListSkeleton;