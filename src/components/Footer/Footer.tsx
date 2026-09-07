import { FooterPostLogin, FooterLegal } from '@pagopa/mui-italia';
import { IOFeaturesBanner } from '../IOFeaturesBanner/IOFeaturesBanner';
import { BonusPariInfo } from '../BonusPARIInfo/BonusPARIInfo';
import { IOBanner } from '../IOBanner/IOBanner';

const FOOTER_LINKS = {
    COMPANY: 'https://www.pagopa.it/it/',
    PRIVACY: 'https://bonuselettrodomestici.it/utente/privacy-policy',
    PERSONAL_DATA: 'https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8',
    TERMS_AND_CONDITIONS: 'https://bonuselettrodomestici.it/utente/terms-of-service',
    A11Y: 'https://form.agid.gov.it/view/9b5c6ed0-bbbb-11f0-a7e5-9bac06d781c9'
} as const;

const openExternalLink = (url: string) => window.open(url, '_blank')?.focus();

export const Footer = () => {

    return (
        <>
            <IOFeaturesBanner />
            <BonusPariInfo />
            <IOBanner />
            <FooterPostLogin
                companyLink={{
                    ariaLabel: 'PagoPA SPA',
                    href: FOOTER_LINKS.COMPANY,
                    onClick: () => openExternalLink(FOOTER_LINKS.COMPANY)
                }}
                links={[
                    {
                        label: 'Informativa Privacy',
                        ariaLabel: 'Informativa Privacy',
                        href: FOOTER_LINKS.PRIVACY,
                        linkType: 'external',
                        onClick: () => openExternalLink(FOOTER_LINKS.PRIVACY)
                    },
                    {
                        label: 'Diritto alla protezione dei dati personali',
                        ariaLabel: 'Diritto alla protezione dei dati personali',
                        linkType: 'external',
                        href: FOOTER_LINKS.PERSONAL_DATA,
                        onClick: () => openExternalLink(FOOTER_LINKS.PERSONAL_DATA)
                    },
                    {
                        label: "Termini e condizioni d'uso",
                        ariaLabel: "Termini e condizioni d'uso",
                        href: FOOTER_LINKS.TERMS_AND_CONDITIONS,
                        linkType: 'external',
                        onClick: () => openExternalLink(FOOTER_LINKS.TERMS_AND_CONDITIONS)
                    },
                    {
                        label: 'Accessibilità',
                        ariaLabel: 'Accessibilità',
                        linkType: 'external',
                        href: FOOTER_LINKS.A11Y,
                        onClick: () => openExternalLink(FOOTER_LINKS.A11Y)
                    }
                ]}
                currentLangCode={'it'}
                languages={{
                    it: {
                        it: 'Italiano'
                    }
                }}
                onLanguageChanged={() => { }}
            />
            <FooterLegal
                content={
                    <span style={{ whiteSpace: 'pre-line' }}>
                        <b>PagoPA S.p.A.</b> - Società per azioni con socio unico - Capitale sociale di euro 1,000,000 interamente versato - Sede legale in Roma, Piazza Colonna 370, CAP 00187 - N. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
                    </span>
                }
            />
        </>
    );
};