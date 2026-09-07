import { useEffect, useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  TableSortLabel,
  Box,
} from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Store, Devices } from '@mui/icons-material'
import { ButtonNaked, theme } from '@pagopa/mui-italia'
import CustomPaginator from '../Paginator/CustomPaginator'
import PhysicalStoreFilters from '../PhysicalStoreFilters/PhysicalStoreFilters'
import { useIsMobile } from '../../hooks/useIsMobile'
import MobileStoreCard from './MobileStoreCard'
import { StoreDetailsDrawer } from '../StoreDetailsDrawer/StoreDetailsDrawer'

export interface PhysicalStore {
  id: string
  type: 'PHYSICAL'
  franchiseName: string
  address: string
  city: string
  region: string
  province: string
  streetNumber?: string
  zipCode?: string
  channelPhone?: string
  website?: string
}

export interface OnlineStore {
  id: string
  type: 'ONLINE'
  franchiseName: string
  website?: string
}

export type Store = PhysicalStore | OnlineStore

interface Column {
  id: string
  label: string
  align: 'left' | 'center' | 'right' | 'inherit' | 'justify'
  width: string
}

const physicalColumns: Column[] = [
  { id: 'franchiseName', label: 'Esercente', align: 'left', width: '33%' },
  { id: 'address', label: 'Indirizzo', align: 'left', width: '34%' },
  { id: 'city', label: 'Città', align: 'left', width: '26%' },
  { id: 'actions', label: '', align: 'right', width: '7%' },
]

const onlineColumns: Column[] = [
  { id: 'franchiseName', label: 'Esercente', align: 'left', width: '40%' },
  { id: 'website', label: 'URL', align: 'left', width: '53%' },
  { id: 'actions', label: '', align: 'right', width: '7%' },
]

interface StoreListProps {
  data: Store[]
}

const StoreList = (json: StoreListProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const [orderBy, setOrderBy] = useState<string>('franchiseName')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState<number>(1)
  const [filters, setFilters] = useState<{
    franchiseName?: string | null
    region?: string | null
    province?: string | null
    city?: string | null
  }>({})
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = isOnline ? onlineColumns : physicalColumns

  const sanitizeStore = <T extends Omit<Store, 'id'>>(store: T): T => {
    const sanitized = { ...store }
    
    Object.keys(sanitized).forEach((key) => {
      const value = sanitized[key as keyof T]
      if (typeof value === 'string') {
        (sanitized as Record<string, unknown>)[key] = value.trim().replace(/\s+/g, ' ')
      }
    })
    
    return sanitized
  }

  const data = useMemo(() => {
    return json.data
      .filter((store) => isOnline ? store.type === 'ONLINE' : store.type === 'PHYSICAL')
      .map((store, idx) => ({
        ...sanitizeStore(store),
        id: `${store.type}-${store.franchiseName.trim()}-${idx}`
      }))
  }, [json.data, isOnline])

  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setPage(1)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setSelectedStore(null)
  }
  const handleOpenDrawer = (store: Store) => {
    setSelectedStore(store)
    setDrawerOpen(true)
  }

  const handleSort = (property: keyof Store) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const normalizeString = (str: string): string => {
    return str.toLowerCase().replace(/\s+/g, '');
  };

  const filteredAndSortedData = useMemo(() => {
    setPage(1)
    let filtered = data

    if (!isOnline) {
      filtered = filtered
        .filter((s): s is PhysicalStore => s.type === 'PHYSICAL')
        .filter((s) => {
          const matchFranchise =
            !filters.franchiseName ||
            normalizeString(s.franchiseName).includes(normalizeString(filters.franchiseName))

          const matchRegion = !filters.region || s.region === filters.region
          const matchProvince = !filters.province || s.province === filters.province
          const matchCity = !filters.city || s.city === filters.city

          return matchFranchise && matchRegion && matchProvince && matchCity
        })
    } else {
      filtered = filtered.filter((s): s is OnlineStore => s.type === 'ONLINE')
    }

    const sorted = [...filtered].sort((a, b) => {
      const aValue = String(a[orderBy as keyof typeof a] ?? '')
      const bValue = String(b[orderBy as keyof typeof b] ?? '')
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

    return sorted
  }, [data, order, orderBy, filters, isOnline])


  const startIndex = (page - 1) * rowsPerPage
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage)

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: "center",
            gap: 0,
            backgroundColor: '#FFFFFF',
            px: { xs: 2, md: 8 },
            pt: 1.5,
            pb: {xs: 0, sm: 3, md: 3},
          }}
        >
          {isMobile ?
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                // maxWidth: 360,
                borderRadius: '6px',
                overflow: 'hidden',
                height: 38,
                // border: '1px solid #0B3EE3',
              }}
            >
              <ButtonNaked
                onClick={() => { setIsOnline(false); setOrderBy("franchiseName"); setOrder("asc") }}
                fullWidth
                sx={{
                  backgroundColor: !isOnline ? '#EAF0FF' : '#FFFFFF',
                  color: '#0B3EE3',
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: '20px',
                  textTransform: 'none',
                  borderTopLeftRadius: '6px',
                  borderBottomLeftRadius: '6px',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderRight: '1px solid #0B3EE3',
                  borderWidth: !isOnline ? '2px 1px 2px 2px' : '1px 1px 1px 1px',
                  borderStyle: 'solid',
                  borderColor: '#0B3EE3',
                  minHeight: '36px',
                  transition: 'all 0.15s ease',
                  p: 0,
                  '&:hover': {
                    backgroundColor: !isOnline ? '#EAF0FF' : '#F3F6FF',
                  },
                  '&:focus': {
                    color: '#0B3EE3',
                    backgroundColor: !isOnline ? '#EAF0FF' : '#FFFFFF',
                  },
                  '&:active': {
                    color: '#0B3EE3',
                    backgroundColor: !isOnline ? '#EAF0FF' : '#F3F6FF',
                  },
                }}
              >
                Fisico
              </ButtonNaked>

              <ButtonNaked
                onClick={() => { setIsOnline(true); setOrderBy("franchiseName"); setOrder("asc") }}
                fullWidth
                sx={{
                  backgroundColor: isOnline ? '#EAF0FF' : '#FFFFFF',
                  color: '#0B3EE3',
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: '20px',
                  textTransform: 'none',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: '6px',
                  borderBottomRightRadius: '6px',
                  borderRight: '1px solid #0B3EE3',
                  borderWidth: isOnline ? '2px 1px 2px 2px' : '1px 1px 1px 1px',
                  borderStyle: 'solid',
                  borderColor: '#0B3EE3',
                  minHeight: '36px',
                  transition: 'all 0.15s ease',
                  p: 0,
                  '&:hover': {
                    backgroundColor: isOnline ? '#EAF0FF' : '#F3F6FF',
                  },
                  '&:focus': {
                    color: '#0B3EE3',
                    backgroundColor: isOnline ? '#EAF0FF' : '#FFFFFF',
                  },
                  '&:active': {
                    color: '#0B3EE3',
                    backgroundColor: isOnline ? '#EAF0FF' : '#F3F6FF',
                  },
                }}
              >
                Online
              </ButtonNaked>
            </Box>
            :
            <>
              <ButtonNaked
                size="medium"
                color="primary"
                weight="default"
                startIcon={<Store sx={{ fontSize: 18 }} />}
                onClick={() => { setIsOnline(false); setOrderBy("franchiseName"); setOrder("asc") }}
                sx={{
                  width: "50%",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: isOnline ? '2px solid #E0E0E0' : '2px solid #0B3EE3',
                  borderRadius: 0,
                  color: isOnline ? '#6B7280' : '#0B3EE3',
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: '40px',
                  px: 0,
                  pb: 0.2,
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                  '& .MuiButton-startIcon': {
                    marginRight: '6px',
                    marginLeft: 0,
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Punti vendita
              </ButtonNaked>

              <ButtonNaked
                size="medium"
                color="primary"
                weight="default"
                startIcon={<Devices sx={{ fontSize: 18 }} />}
                onClick={() => { setIsOnline(true); setOrderBy("franchiseName"); setOrder("asc") }}
                sx={{
                  width: "50%",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: isOnline ? '2px solid #0B3EE3' : '2px solid #E0E0E0',
                  borderRadius: 0,
                  color: isOnline ? '#0B3EE3' : '#6B7280',
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: '40px',
                  px: 0,
                  pb: 0.2,
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                  '& .MuiButton-startIcon': {
                    marginRight: '6px',
                    marginLeft: 0,
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Negozio online
              </ButtonNaked>
            </>
          }
        </Box>

        {!isOnline && (
          <PhysicalStoreFilters
            stores={json.data.filter((s) => s.type === 'PHYSICAL')}
            filters={filters}
            onFilter={handleFilterChange}
            onClear={handleClearFilters}
          />
        )}

        <Box sx={{ px: { xs: 2, md: 8 } }}>
          {isMobile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: isOnline ? 0 : 2 }}>
              {paginatedData.map((row) => (
                <MobileStoreCard key={row.id} store={row} onClick={() => handleOpenDrawer(row)} isOnline={isOnline} />
              ))}
            </Box>
          ) : (
            <TableContainer
              component="div"
              sx={{
                width: '100%',
                overflowX: 'auto',
                backgroundColor: 'transparent',
              }}
            >
              <Table
                sx={{
                  width: '100%',
                  tableLayout: 'fixed',
                  borderCollapse: 'collapse',
                  backgroundColor: 'transparent',
                }}
              >
                <TableHead sx={{ backgroundColor: 'transparent' }}>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        align={col.align}
                        sortDirection={orderBy === col.id ? order : false}
                        sx={{
                          width: col.width,
                          fontWeight: 600,
                          fontSize: 14,
                          color: '#6b7280',
                          borderBottom: '1px solid #e5e7eb',
                          px: 3,
                          py: 1.5,
                          backgroundColor: 'transparent',
                          verticalAlign: 'bottom'
                        }}
                      >
                        {col.id !== 'actions' ? (
                          <TableSortLabel
                            active={orderBy === col.id}
                            direction={orderBy === col.id ? order : 'asc'}
                            onClick={() => handleSort(col.id as keyof Store)}
                            sx={{
                              '& .MuiTableSortLabel-icon': {
                                color: '#6b7280 !important',
                              },
                              '&.Mui-active': {
                                color: '#1f2937',
                              },
                            }}
                          >
                            {col.label}
                          </TableSortLabel>
                        ) : (
                          col.label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedData.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          backgroundColor: theme.palette.background.paper,
                          '&:hover': { backgroundColor: '#f9fafb' },
                          borderBottom: '2px solid #E3E7EB',
                        }}
                      >
                        <TableCell align="left" sx={{ px: 3, py: 1.5 }}>
                          <Tooltip title={row.franchiseName} arrow placement="bottom-start">
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                color: '#1f2937',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                              }}
                            >
                              {row.franchiseName}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        {row.type === 'ONLINE' ? (
                          <TableCell align="left" sx={{ px: 3, py: 1.5 }}>
                            {row.website ? (
                              <Tooltip title={row.website} arrow placement="bottom-start">
                                <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{
                                    color: '#0B3EE3',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => window.open(row.website, '_blank')}
                                >
                                  {row.website}
                                </Typography>
                              </Tooltip>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                                -
                              </Typography>
                            )}
                          </TableCell>
                        ) : (
                          <>
                            <TableCell align="left" sx={{ px: 3, py: 1.5 }}>
                              <Tooltip title={`${row.address}${row.streetNumber ? `, ${row.streetNumber}` : ''}`} arrow placement="bottom-start">
                                <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{
                                    color: '#1f2937',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block',
                                  }}
                                >
                                  {`${row.address}${row.streetNumber && row.streetNumber !== undefined ? `, ${row.streetNumber}` : ''}`}
                                </Typography>
                              </Tooltip>
                            </TableCell>

                            <TableCell align="left" sx={{ px: 3, py: 1.5 }}>
                              <Tooltip title={row.city} arrow placement="bottom-start">
                                <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{
                                    color: '#1f2937',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block',
                                  }}
                                >
                                  {row.city}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          </>
                        )}

                        <TableCell align="right" sx={{ px: 3, py: 1.5 }}>
                          <IconButton
                            size="small"
                            sx={{ width: 28, height: 28 }}
                            onClick={() => handleOpenDrawer(row)}
                          >
                            <ArrowForwardIosIcon sx={{ fontSize: 14, color: '#0B3EE3' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <CustomPaginator
            sortedData={filteredAndSortedData}
            page={page}
            setPage={setPage}
            ROWS_PER_PAGE={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </Box>
      </Box>
      <StoreDetailsDrawer open={drawerOpen} onClose={handleDrawerClose} store={selectedStore} />
    </>
  )
}

export default StoreList