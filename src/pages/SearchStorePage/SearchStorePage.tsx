import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ProductsList from "../../components/StoreList/StoreList";
import { theme } from "@pagopa/mui-italia";
import StoreListSkeleton from "../../components/StoreListSkeleton/StoreListSkeleton";

const SearchStorePage = () => {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const doFetch = async () => {
      await fetch(`${import.meta.env.BASE_URL}data/pos_export.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel caricamento del file JSON");
          return res.json();
        })
        .then((data) => setStores(data))
        .catch((err) => console.log(err.message))
        .finally(() => setIsLoading(false));
    }
    doFetch();
  }, []);

  return (
    <>
      <Box textAlign="center" py={6} px={2} bgcolor={theme.palette.primary.contrastText}>
        <Typography variant="h1" fontWeight="700" gutterBottom>
          Cerca un negozio
        </Typography>

        <Typography variant="h6" fontWeight="400">
          Puoi usare il tuo Bonus Elettrodomestici nei negozi fisici e online
        </Typography>
        <Typography variant="h6" fontWeight="400">
          che aderiscono all’iniziativa.
        </Typography>

        <Typography variant="h6" fontWeight="400" gutterBottom>
          La lista è in aggiornamento.
        </Typography>
      </Box>
      <Box sx={{ pb: { xs: 4, md: 2 } }}>
        {isLoading ? <StoreListSkeleton /> : <ProductsList data={stores} />}
      </Box>
    </>
  );
};

export default SearchStorePage;
