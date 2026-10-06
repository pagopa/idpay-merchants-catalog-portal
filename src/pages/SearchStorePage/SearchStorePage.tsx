import { appConfig } from "../../config/app";
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
      await fetch(appConfig.storesUrl, { cache: "no-store" })
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
          {appConfig.copy.searchPage.title}
        </Typography>

        <Typography variant="h6" fontWeight="400" sx={{ whiteSpace: 'pre-line' }} gutterBottom>
          {appConfig.copy.searchPage.description}
        </Typography>
      </Box>
      <Box sx={{ pb: { xs: 4, md: 2 } }}>
        {isLoading ? <StoreListSkeleton /> : <ProductsList data={stores} />}
      </Box>
    </>
  );
};

export default SearchStorePage;
