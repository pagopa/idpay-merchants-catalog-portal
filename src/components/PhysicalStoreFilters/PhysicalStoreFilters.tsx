import React, { useEffect, useMemo, useState } from 'react'
import {
    Autocomplete,
    Box,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    Button,
    Drawer,
    Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterAlt from '@mui/icons-material/FilterAlt'
import CloseIcon from '@mui/icons-material/Close'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { PhysicalStore } from '../StoreList/StoreList'
import provinceData from "../../assets/province.json";

type Province = {
    nome: string;
    sigla: string;
    regione: string;
};

const provinceMap: Record<string, string> = Object.fromEntries(
    (provinceData as Province[]).map(({ sigla, nome }) => [sigla, nome])
);

interface PhysicalStoreFiltersProps {
    stores: PhysicalStore[]
    filters: {
        franchiseName?: string | null
        region?: string | null
        province?: string | null
        city?: string | null
    }
    onFilter: (filters: {
        franchiseName?: string | null
        region?: string | null
        province?: string | null
        city?: string | null
    }) => void
    onClear: () => void
}

const PhysicalStoreFilters: React.FC<PhysicalStoreFiltersProps> = ({
    stores,
    filters,
    onFilter,
    onClear,
}) => {
    const isMobile = useIsMobile()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)

    const [selectedFranchise, setSelectedFranchise] = useState<string | null>(filters.franchiseName || null)
    const [selectedRegion, setSelectedRegion] = useState<string | null>(filters.region || null)
    const [selectedProvince, setSelectedProvince] = useState<string | null>(filters.province || null)
    const [selectedCity, setSelectedCity] = useState<string | null>(filters.city || null)

    useEffect(() => {
        setSelectedFranchise(filters.franchiseName || null)
        setSelectedRegion(filters.region || null)
        setSelectedProvince(filters.province ? (provinceMap[filters.province] || filters.province) : null)
        setSelectedCity(filters.city || null)
    }, [filters])

    const regions = useMemo(
        () => [...new Set(stores.map((s) => s.region))].sort((a, b) => a.localeCompare(b)),
        [stores]
    )

    const provinces = useMemo(() => {
        const shortProvinces = [
            ...new Set(
                stores
                    .filter((s) => !selectedRegion || s.region === selectedRegion)
                    .map((s) => s.province)
            ),
        ].sort((a, b) => a.localeCompare(b));

        return shortProvinces.map((sigla) => provinceMap[sigla] || sigla);
    }, [stores, selectedRegion]);

    const provinceNameToSigla: Record<string, string> = useMemo(
        () => Object.fromEntries(
            (provinceData as Province[]).map(({ sigla, nome }) => [nome, sigla])
        ),
        []
    );

    const cities = useMemo(
        () => {
            const provinceSigla = selectedProvince ? provinceNameToSigla[selectedProvince] : null;
            
            return [...new Set(
                stores
                    .filter((s) =>
                        (!selectedRegion || s.region === selectedRegion) &&
                        (!provinceSigla || s.province === provinceSigla)
                    )
                    .map((s) => s.city)
            )].sort((a, b) => a.localeCompare(b));
        },
        [stores, selectedRegion, selectedProvince, provinceNameToSigla]
    )

    const normalizeKey = (v: string) =>
        v
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/\u00A0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

    const provinceSigla = selectedProvince ? provinceNameToSigla[selectedProvince] : null;

    const filteredStoresForAutocomplete = useMemo(() => {
        return stores.filter(s =>
            (!selectedRegion || s.region === selectedRegion) &&
            (!provinceSigla || s.province === provinceSigla) &&
            (!selectedCity || s.city === selectedCity)
        );
    }, [stores, selectedRegion, provinceSigla, selectedCity]);

    const franchiseNames = useMemo(() => {
        return [...new Set(filteredStoresForAutocomplete.map(s => s.franchiseName))].sort((a, b) =>
            normalizeKey(a).localeCompare(normalizeKey(b), 'it', {
                sensitivity: 'base',
                numeric: true,
                ignorePunctuation: true,
            })
        );
    }, [filteredStoresForAutocomplete]);

    const handleFilter = () => {
        const provinceSigla = selectedProvince ? provinceNameToSigla[selectedProvince] : null;
        onFilter({
            franchiseName: selectedFranchise || null,
            region: selectedRegion || null,
            province: provinceSigla || null,
            city: selectedCity || null,
        })
        setDrawerOpen(false)
    }

    const handleClear = () => {
        setSelectedFranchise(null)
        setSelectedRegion(null)
        setSelectedProvince(null)
        setSelectedCity(null)
        onClear()
    }

    const baseInputSx = {
        '& .MuiOutlinedInput-root': {
            fontWeight: 500,
            '& fieldset': { borderColor: '#E0E0E0' },
            '&:hover fieldset': { borderColor: '#B0B0B0' },
            '&.Mui-focused fieldset': { borderColor: '#0B3EE3', borderWidth: 2 },
        },
        '& .MuiInputLabel-root': { color: '#6B7280', fontWeight: 600 },
        '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
            color: '#0B3EE3',
        },
    }

    const searchInputSx = {
        ...baseInputSx,
        '& .MuiInputLabel-root': {
            color: '#6B7280',
            fontWeight: 600,
            transform: 'translate(28px, 8px) scale(1)',
        },
        '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
            color: '#0B3EE3',
            transform: 'translate(17px, -8px) scale(0.7)',
        },
    }

    const dropdownInputSx = {
        ...baseInputSx,
        '& .MuiSelect-icon': { color: 'unset !important' },
        '& .MuiOutlinedInput-input': { color: '#000', fontWeight: 500, paddingRight: '8px !important', },
    }

    const ClearCircleIcon = ({ onClick }: { onClick: () => void }) => (
        <IconButton
            size="medium"
            onClick={onClick}
            sx={{
                width: 22,
                height: 22,
                backgroundColor: '#5F6B7A',
                '&:hover': { backgroundColor: '#4A5568' },
                color: '#fff',
                p: 0,
            }}
        >
            <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
    )

    const ClearCircleBox = () => (<Box sx={{ width: 22, height: 22, backgroundColor: '#5F6B7A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { backgroundColor: '#4A5568' }, }} > <CloseIcon sx={{ fontSize: 16, color: '#fff' }} /> </Box>)

    const getFilterCount = () => {
        let count = 0;
        if (selectedFranchise) count++
        if (selectedRegion) count++
        if (selectedProvince) count++
        if (selectedCity) count++
        if (count !== 0) return " (" + count + ")";
        return ""
    }

    const normalizeString = (str: string): string => str.toLowerCase().replace(/\s+/g, '');

    if (!isMobile) {
        return (
            <Box
                sx={{
                    backgroundColor: '#fff',
                    p: 2,
                    mb: 2,
                    boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 2,
                    px: { xs: 2, md: 8 },
                    justifyContent: 'space-between',
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        minWidth: "18%",
                        width: { xs: '100%', sm: '100%', md: 'auto' },
                    }}
                >
                    <Autocomplete
                        freeSolo
                        options={franchiseNames}
                        filterOptions={(options, { inputValue }) => {
                            if (inputValue.length < 3) {
                                return [];
                            }

                            const normalizedInput = normalizeString(inputValue);
                            return options.filter(option =>
                                normalizeString(option).includes(normalizedInput)
                            );
                        }}
                        inputValue={selectedFranchise || ''}
                        onInputChange={(_, value) => {
                            setSelectedFranchise(value)
                            onFilter({
                                franchiseName: value || null,
                                region: selectedRegion || null,
                                province: selectedProvince ? provinceNameToSigla[selectedProvince] : null,
                                city: selectedCity || null,
                            })
                        }}
                        clearIcon={<ClearCircleBox />}
                        sx={{
                            '& .MuiInputBase-input': {
                                paddingLeft: '24px !important',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            },
                        }}
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                                <Box key={key} component="li" {...otherProps} sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100%',
                                }}>
                                    {option}
                                </Box>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Esercente"
                                variant="outlined"
                                size="small"
                                fullWidth
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                sx={searchInputSx}
                                InputLabelProps={{
                                    shrink: searchFocused || !!selectedFranchise,
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{ ml: 1, position: 'absolute', left: 0 }}
                                        >
                                            <SearchIcon
                                                sx={{
                                                    color: searchFocused ? '#0B3EE3' : '#6B7280',
                                                    fontSize: 18,
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                    sx: { pl: 2 },
                                }}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ flex: 1, minWidth: "15%", width: { xs: '100%', sm: '100%', md: 'auto' }, }}>
                    <TextField
                        select
                        label="Regione"
                        value={selectedRegion || ''}
                        onChange={(e) => {
                            setSelectedRegion(e.target.value)
                            setSelectedProvince(null)
                            setSelectedCity(null)
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={dropdownInputSx}
                        InputProps={{
                            endAdornment: selectedRegion ? (
                                <InputAdornment position="end" sx={{ mr: 1 }}>
                                    <ClearCircleIcon
                                        onClick={() => {
                                            setSelectedRegion(null)
                                            setSelectedProvince(null)
                                            setSelectedCity(null)
                                        }}
                                    />
                                </InputAdornment>
                            ) : null,
                        }}
                    >
                        {regions.map((r, i) => (
                            <MenuItem
                                key={r + i}
                                value={r}
                                sx={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {r}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ flex: 1, minWidth: "15%", width: { xs: '100%', sm: '100%', md: 'auto' }, }}>

                    <TextField
                        select
                        label="Provincia"
                        value={selectedProvince || ''}
                        onChange={(e) => {
                            setSelectedProvince(e.target.value)
                            setSelectedCity(null)
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={dropdownInputSx}
                        disabled={!selectedRegion}
                        InputProps={{
                            endAdornment: selectedProvince ? (
                                <InputAdornment position="end" sx={{ mr: 1 }}>
                                    <ClearCircleIcon
                                        onClick={() => {
                                            setSelectedProvince(null)
                                            setSelectedCity(null)
                                        }}
                                    />
                                </InputAdornment>
                            ) : null,
                        }}
                    >
                        {provinces.map((p, i) => (
                            <MenuItem
                                key={p + i}
                                value={p}
                                sx={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {p}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ flex: 1, minWidth: "15%", width: { xs: '100%', sm: '100%', md: 'auto' }, }}>
                    <TextField
                        select
                        label="Città"
                        value={selectedCity || ''}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={dropdownInputSx}
                        disabled={!selectedProvince}
                        InputProps={{
                            endAdornment: selectedCity ? (
                                <InputAdornment position="end" sx={{ mr: 1 }}>
                                    <ClearCircleIcon onClick={() => setSelectedCity(null)} />
                                </InputAdornment>
                            ) : null,
                        }}
                    >
                        {cities.map((c, i) => (
                            <MenuItem
                                key={c + i}
                                value={c}
                                sx={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {c}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 1,
                        flexShrink: 0,
                        flex: { xs: 1, md: 'unset' },
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#0B3EE3',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 2.5,
                            '&:hover': { backgroundColor: '#0036cc' },
                        }}
                        onClick={handleFilter}
                    >
                        Filtra
                    </Button>
                    <Button
                        variant="text"
                        onClick={handleClear}
                        sx={{
                            color: '#0B3EE3',
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Rimuovi filtri
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                py: 3,
                pr: 0,
                mb: 2,
                boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >

            <Button
                variant="text"
                onClick={() => setDrawerOpen(true)}
                sx={{
                    color: '#0B3EE3',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    alignSelf: 'flex-end',
                    '& svg': { fontSize: 18 },
                }}
            >
                <FilterAlt sx={{ color: '#0B3EE3' }} />
                {"Filtra" + getFilterCount()}
            </Button>

            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        p: 3,
                        pb: 6,
                        backgroundColor: '#fff',
                    },
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: '#374151',
                            letterSpacing: 0.5,
                            fontSize: 14,
                        }}
                    >
                        Filtra
                    </Typography>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#374151' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <Autocomplete
                        freeSolo
                        options={franchiseNames}
                        filterOptions={(options, { inputValue }) => {
                            if (inputValue.length < 3) {
                                return [];
                            }

                            const normalizedInput = normalizeString(inputValue);
                            return options.filter(option =>
                                normalizeString(option).includes(normalizedInput)
                            );
                        }}
                        inputValue={selectedFranchise || ''}
                        onInputChange={(_, value) => {
                            setSelectedFranchise(value)
                            onFilter({
                                franchiseName: value || null,
                                region: selectedRegion || null,
                                province: selectedProvince ? provinceNameToSigla[selectedProvince] : null,
                                city: selectedCity || null,
                            })
                        }}
                        clearIcon={<ClearCircleBox />}
                        sx={{
                            '& .MuiInputBase-input': {
                                paddingLeft: '24px !important',
                            },
                        }}
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                                <Box key={key} component="li" {...otherProps} sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100%',
                                }}>
                                    {option}
                                </Box>
                            );
                        }}
                        renderInput={(params) => (

                            <TextField
                                {...params}
                                label="Esercente"
                                variant="outlined"
                                size="small"
                                fullWidth
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                sx={searchInputSx}
                                InputLabelProps={{ shrink: searchFocused || !!selectedFranchise }}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ ml: 1, position: 'absolute', left: 0 }}>
                                            <SearchIcon
                                                sx={{
                                                    color: searchFocused ? '#0B3EE3' : '#6B7280',
                                                    fontSize: 18,
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        select
                        label="Regione"
                        value={selectedRegion || ''}
                        onChange={(e) => {
                            setSelectedRegion(e.target.value)
                            setSelectedProvince(null)
                            setSelectedCity(null)
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={dropdownInputSx}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: { mt: 1 },
                                },
                            },
                        }}
                    >
                        {regions.map((r, i) => (
                            <MenuItem
                                key={r + i}
                                value={r}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    maxWidth: '100%',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {r}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Provincia"
                        value={selectedProvince || ''}
                        onChange={(e) => {
                            setSelectedProvince(e.target.value)
                            setSelectedCity(null)
                        }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={dropdownInputSx}
                        disabled={!selectedRegion}
                    >
                        {provinces.map((p, i) => (
                            <MenuItem
                                key={p + i}
                                value={p}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    maxWidth: '100%',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {p}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Città"
                        value={selectedCity || ''}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={dropdownInputSx}
                        disabled={!selectedProvince}
                    >
                        {cities.map((c, i) => (
                            <MenuItem
                                key={c + i}
                                value={c}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    maxWidth: '100%',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {c}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#0B3EE3',
                            textTransform: 'none',
                            fontWeight: 700,
                            mt: 1,
                            py: 1.2,
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: '#0036cc' },
                        }}
                        onClick={handleFilter}
                    >
                        Filtra
                    </Button>

                    <Button
                        variant="text"
                        fullWidth
                        sx={{
                            color: selectedRegion || selectedProvince || selectedCity || selectedFranchise ? '#0B3EE3' : '#6B7280',
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                        onClick={handleClear}
                    >
                        Annulla filtri
                    </Button>
                </Box>
            </Drawer>
        </Box>
    )
}

export default PhysicalStoreFilters