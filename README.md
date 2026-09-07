# idpay-merchants-catalog-portal
Merchants catalogs, frontend apps, and supporting services.

## Local development

Run `yarn install --frozen-lockfile` and `yarn dev`, then open
http://localhost:5173/lista-punti-vendita/.
`VITE_INITIATIVE` is empty by default; `.env.example` documents this setting.

## Deployment pipeline

Create an Azure DevOps pipeline pointing to
`.devops/multi-initiative-deploy-pipelines.yml`, following the users portal setup.
The `INITIATIVE` parameter supplies `VITE_INITIATIVE` during the build and selects
the storage destination and CDN purge path:

`https://[ENV].pari.pagopa.it/[INITIATIVE]/lista-punti-vendita/`

The available initiatives and default (`bonusdecoder`) match the users portal.
Pushes to `develop` and `uat` trigger deployment using that default. Manual runs
can select a different initiative. Branches starting with `uat` or `hotfix` use
UAT, `main` uses PROD, and other branches use DEV.

Configure these Azure DevOps variables for each `DEV`, `UAT`, and `PROD` prefix:

- `<ENV>_AZURE_SUBSCRIPTION`: Azure service connection
- `<ENV>_STORAGE_ACCOUNT`
- `<ENV>_RESOURCE_GROUP`
- `<ENV>_CDN_PROFILE`
- `<ENV>_CDN_ENDPOINT`
- `<ENV>_CDN_DOMAINS`: space-separated Front Door domains

Also configure `blob_container_name` and authorize the
`io-azure-devops-github-ro` connection for the shared pipeline templates.
The host must route the initiative path to the corresponding storage prefix.

The pipeline builds and publishes `dist`, syncs it to
`[INITIATIVE]/lista-punti-vendita/`, and purges that path in Front Door.
It does not require the users portal's API generation or authentication variables.
