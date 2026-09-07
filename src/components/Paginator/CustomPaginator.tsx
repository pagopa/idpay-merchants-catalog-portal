import React from 'react';
import { Box, IconButton, Typography, MenuItem, Select } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CustomPaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

function CustomPaginationActions({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: CustomPaginationActionsProps) {
  const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        disableRipple
        onClick={handleBack}
        disabled={page === 0}
        sx={{
          width: 32,
          height: 32,
          color: page === 0 ? '#d1d5db' : '#6b7280',
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        <ChevronLeft sx={{ fontSize: 22 }} />
      </IconButton>

      <IconButton
        disableRipple
        onClick={handleNext}
        disabled={page >= lastPage}
        sx={{
          width: 32,
          height: 32,
          color: page >= lastPage ? '#d1d5db' : '#6b7280',
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        <ChevronRight sx={{ fontSize: 22 }} />
      </IconButton>
    </Box>
  );
}

interface CustomPaginatorProps {
  sortedData: any[];
  page: number;
  setPage: (page: number) => void;
  ROWS_PER_PAGE: number;
  setRowsPerPage: (rows: number) => void;
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function CustomPaginator({
  sortedData,
  page,
  setPage,
  ROWS_PER_PAGE,
  setRowsPerPage,
}: CustomPaginatorProps) {
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
        justifyContent: { xs: 'flex-end', md: 'flex-end' },
        flexWrap: 'wrap',
        gap: { xs: 1, md: 2 },
        width: '100%',
        mt: {xs: 2, sm: 1, md: 1},
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-end', md: 'flex-end' },
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 1,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
            Elementi per pagina
          </Typography>
          <Select
            value={ROWS_PER_PAGE}
            onChange={(e) => handleChangeRowsPerPage(e as any)}
            variant="standard"
            disableUnderline
            sx={{
              fontSize: 14,
              color: '#6b7280',
              minWidth: 48,
              '& .MuiSelect-select': { padding: 0 },
              '& .MuiSelect-icon': { color: '#6b7280' },
            }}
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
            {`${(page - 1) * ROWS_PER_PAGE + 1} - ${Math.min(
              page * ROWS_PER_PAGE,
              sortedData.length
            )} di ${sortedData.length}`}
          </Typography>

          <CustomPaginationActions
            count={sortedData.length}
            page={page - 1}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={(_, newPage) => setPage(newPage + 1)}
          />
        </Box>
      </Box>
    </Box>
  );
}