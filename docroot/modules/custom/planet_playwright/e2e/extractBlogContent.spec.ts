import { test } from '@playwright/test';
import fs from 'fs';

test.setTimeout(600000);

test('extract content and store in JSON', async ({ browser }) => {
    const urls = [
        "https://planet.lndo.site/blog/quick-overview-hotel-revenue-management",
        "https://planet.lndo.site/blog/hotel-management-system-guide",
        "https://planet.lndo.site/es/blog/guia-sistema-gestion-hotelera",
        "https://planet.lndo.site/fr/blog/quest-ce-qu-un-systeme-gestion-hoteliere",
        "https://planet.lndo.site/it/blog/hotel-management-system-guide",
        "https://planet.lndo.site/de/blog/hotel-management-system-leitfaden",
        "https://planet.lndo.site/blog/hotel-guest-types",
        "https://planet.lndo.site/blog/online-travel-agents-otas",
        "https://planet.lndo.site/blog/how-simplified-payments-save-time-hotels-and-guests",
        "https://planet.lndo.site/blog/why-order-management-systems-important",
        "https://planet.lndo.site/blog/retail-software-omnichannel-era",
        "https://planet.lndo.site/blog/what-is-pay-by-link",
        "https://planet.lndo.site/blog/what-dynamic-currency-conversion-dcc",
        "https://planet.lndo.site/es/blog/que-es-conversion-dinamica-divisas-dcc",
        "https://planet.lndo.site/blog/what-is-acquiring-bank",
        "https://planet.lndo.site/es/blog/que-es-banco-adquirente",
        "https://planet.lndo.site/blog/what-is-buy-now-pay-later",
        "https://planet.lndo.site/blog/api-integrations-payment-gateway",
        "https://planet.lndo.site/blog/what-is-revpar",
        "https://planet.lndo.site/blog/what-is-click-to-pay",
        "https://planet.lndo.site/es/blog/que-es-click-to-pay",
        "https://planet.lndo.site/blog/what-are-embedded-payments",
        "https://planet.lndo.site/blog/differences-issuing-bank-vs-acquiring-bank",
        "https://planet.lndo.site/blog/what-is-epos",
        "https://planet.lndo.site/blog/strong-customer-authentication-sca",
        "https://planet.lndo.site/blog/maximising-retail-potential",
        "https://planet.lndo.site/blog/what-is-digital-wallet",
        "https://planet.lndo.site/blog/hotel-check-software-efficiently-manage-guest-check-ins",
        "https://planet.lndo.site/blog/unified-commerce-vs-connected-commerce",
        "https://planet.lndo.site/blog/what-is-point-sale-pos-system",
        "https://planet.lndo.site/es/blog/que-pos-tpv",
        "https://planet.lndo.site/fr/blog/quest-ce-que-le-systeme-de-points-de-vente",
        "https://planet.lndo.site/blog/what-is-card-acquirer",
        "https://planet.lndo.site/blog/what-is-alipay",
        "https://planet.lndo.site/es/blog/que-es-alipay",
        "https://planet.lndo.site/fr/blog/qu-est-ce-que-cest-alipay",
        "https://planet.lndo.site/it/blog/quello-che-e-alipay",
        "https://planet.lndo.site/de/blog/was-ist-alipay",
        "https://planet.lndo.site/blog/what-is-tokenization",
        "https://planet.lndo.site/es/blog/que-es-la-tokenizacion",
        "https://planet.lndo.site/fr/blog/qu-est-ce-que-la-tokenisation",
        "https://planet.lndo.site/it/blog/che-cos-e-la-tokenizzazione",
        "https://planet.lndo.site/de/blog/was-ist-tokenization",
        "https://planet.lndo.site/blog/alipay-plus",
        "https://planet.lndo.site/blog/misconceptions-click-collect",
        "https://planet.lndo.site/blog/hotel-operating-procedures",
        "https://planet.lndo.site/blog/payment-fraud-detection",
        "https://planet.lndo.site/blog/types-ecommerce-payment-systems",
        "https://planet.lndo.site/blog/why-you-need-hotel-booking-engine",
        "https://planet.lndo.site/blog/what-payment-processor",
        "https://planet.lndo.site/blog/how-to-choose-payment-gateway",
        "https://planet.lndo.site/blog/what-is-chargeback",
        "https://planet.lndo.site/blog/what-is-auth0",
        "https://planet.lndo.site/es/blog/que-es-auth0",
        "https://planet.lndo.site/fr/blog/auth0",
        "https://planet.lndo.site/it/blog/quello-che-e-auth0",
        "https://planet.lndo.site/de/blog/was-ist-auth0",
        "https://planet.lndo.site/blog/what-is-pci-compliance",
        "https://planet.lndo.site/blog/moving-your-prem-system-hosted-solution",
        "https://planet.lndo.site/blog/maximising-occupancy-global-distribution-systems-gds",
        "https://planet.lndo.site/blog/setting-payment-gateway-step-by-step-guide",
        "https://planet.lndo.site/blog/how-to-do-swot-analysis",
        "https://planet.lndo.site/blog/reason-why-retailers-need-endless-aisle",
        "https://planet.lndo.site/blog/what-is-payment-facilitator",
        "https://planet.lndo.site/blog/credit-authorisation-process",
        "https://planet.lndo.site/blog/ecommerce-order-management-systems",
        "https://planet.lndo.site/blog/what-are-intercharge-fees",
        "https://planet.lndo.site/blog/reserve-and-collect",
        "https://planet.lndo.site/es/blog/reserve-collect",
        "https://planet.lndo.site/blog/one-click-checkout",
        "https://planet.lndo.site/blog/zip-pay",
        "https://planet.lndo.site/es/blog/zip-pay",
        "https://planet.lndo.site/blog/integrate-payment-gateway-mobile-app",
        "https://planet.lndo.site/blog/cloud-pos-vs-legacy-pos",
        "https://planet.lndo.site/blog/how-pick-payment-system-your-e-commerce-store",
        "https://planet.lndo.site/blog/what-is-psd3",
        "https://planet.lndo.site/es/blog/que-es-psd3",
        "https://planet.lndo.site/fr/blog/quest-ce-que-le-psd3",
        "https://planet.lndo.site/it/blog/cosa-e-psd3",
        "https://planet.lndo.site/de/blog/was-ist-psd3",
        "https://planet.lndo.site/blog/strategies-hotel-revenue-management",
        "https://planet.lndo.site/blog/what-is-baas",
        "https://planet.lndo.site/blog/do-not-honor-meaning",
        "https://planet.lndo.site/es/blog/que-es-do-not-honor",
        "https://planet.lndo.site/blog/dcc-vs-mcp",
        "https://planet.lndo.site/blog/payment-reconciliation",
        "https://planet.lndo.site/es/blog/pago-conciliacion",
        "https://planet.lndo.site/blog/guest-acquisition-cost",
        "https://planet.lndo.site/blog/what-hotel-channel-manager",
        "https://planet.lndo.site/blog/everything-you-need-know-about-boutique-hotels",
        "https://planet.lndo.site/blog/challenges-ship-store",
        "https://planet.lndo.site/blog/pci-compliance-small-business",
        "https://planet.lndo.site/blog/hotel-inventory-management",
        "https://planet.lndo.site/es/blog/gestion-inventario-hoteles",
        "https://planet.lndo.site/de/blog/hotel-inventar-management",
        "https://planet.lndo.site/blog/property-management-system",
        "https://planet.lndo.site/blog/new-tax-free-threshold-boost-tourist-spending-italy",
        "https://planet.lndo.site/it/blog/nuova-soglia-tax-free-per-incrementare-la-spesa-dei-turisti-in-italia",
        "https://planet.lndo.site/blog/sepa-transfers",
        "https://planet.lndo.site/blog/data-orchestration",
        "https://planet.lndo.site/blog/how-card-readers-work",
        "https://planet.lndo.site/blog/pms-integrations",
        "https://planet.lndo.site/blog/what-is-penetration-testing",
        "https://planet.lndo.site/blog/payment-plugins-e-commerce",
        "https://planet.lndo.site/blog/enhance-online-payment-experience",
        "https://planet.lndo.site/blog/planet-shopper-portal-tax-free-shopping",
        "https://planet.lndo.site/fr/blog/planet-portail-de-lacheteur",
        "https://planet.lndo.site/blog/tax-free-shopping",
        "https://planet.lndo.site/es/blog/compras-tax-free",
        "https://planet.lndo.site/fr/blog/tax-free-shopping",
        "https://planet.lndo.site/it/blog/tax-free-shopping",
        "https://planet.lndo.site/de/blog/tax-free-shopping",
        "https://planet.lndo.site/blog/set-up-end-to-end-payments",
        "https://planet.lndo.site/blog/merchant-id",
        "https://planet.lndo.site/es/blog/merchant-id",
        "https://planet.lndo.site/it/blog/merchant-id",
        "https://planet.lndo.site/blog/mastering-promise-how-atp-drives-retail-success",
        "https://planet.lndo.site/es/blog/atp-available-to-promise-impulsa-exito-retail",
        "https://planet.lndo.site/blog/accept-credit-card-payments",
        "https://planet.lndo.site/blog/accept-in-person-payments",
        "https://planet.lndo.site/blog/real-synergy-between-order-management-systems-and-payment-gateways",
        "https://planet.lndo.site/blog/most-popular-chinese-payment-methods",
        "https://planet.lndo.site/es/blog/metodos-pago-mas-populares-china",
        "https://planet.lndo.site/fr/blog/methodes-paiement-chinoises-les-plus-populaires",
        "https://planet.lndo.site/it/blog/metodi-pagamento-cinesi-piu-popolari",
        "https://planet.lndo.site/de/blog/beliebteste-chinesische-zahlungs-methoden",
        "https://planet.lndo.site/blog/nfc-card-payments",
        "https://planet.lndo.site/blog/tap-to-pay",
        "https://planet.lndo.site/blog/top-event-management-systems",
        "https://planet.lndo.site/blog/essential-steps-optimise-your-mobile-checkout",
        "https://planet.lndo.site/blog/tailored-and-intelligent-order-orchestration",
        "https://planet.lndo.site/blog/how-retailers-can-tap-international-spending",
        "https://planet.lndo.site/blog/improve-guest-experience-hotel-networking",
        "https://planet.lndo.site/blog/what-are-integrated-payments",
        "https://planet.lndo.site/blog/popular-hotel-payment-methods",
        "https://planet.lndo.site/blog/boost-your-business-dynamic-currency-conversion",
        "https://planet.lndo.site/blog/yield-management-hospitality",
        "https://planet.lndo.site/blog/striking-balance-payment-methods-how-many-too-many",
        "https://planet.lndo.site/blog/how-planet-making-tax-free-and-payments-simple-and-fast",
        "https://planet.lndo.site/blog/integrated-payments-how-it-elevates-guest-experience",
        "https://planet.lndo.site/blog/how-get-your-store-ready-olympics-and-uefa",
        "https://planet.lndo.site/blog/most-popular-online-payment-methods-worldwide",
        "https://planet.lndo.site/blog/friendly-fraud",
        "https://planet.lndo.site/blog/benifits-self-service-kiosks",
        "https://planet.lndo.site/blog/integrated-payments-key-hospitality-success-2024",
        "https://planet.lndo.site/blog/euros-kick-summer-spending",
        "https://planet.lndo.site/blog/self-service-kiosks-experts-perspective",
        "https://planet.lndo.site/blog/wechat-pay",
        "https://planet.lndo.site/es/blog/wechat-pay",
        "https://planet.lndo.site/fr/blog/wechat-pay",
        "https://planet.lndo.site/it/blog/wechat-pay",
        "https://planet.lndo.site/de/blog/wechat-pay",
        "https://planet.lndo.site/blog/3c-payment",
        "https://planet.lndo.site/es/blog/3c-payment",
        "https://planet.lndo.site/fr/blog/3c-payment",
        "https://planet.lndo.site/it/blog/3c-payment",
        "https://planet.lndo.site/de/blog/3c-payment",
        "https://planet.lndo.site/blog/bespoke-currency-solutions",
        "https://planet.lndo.site/blog/what-is-merchant-account",
        "https://planet.lndo.site/blog/choose-front-desk-software",
        "https://planet.lndo.site/blog/multi-channel-inventory-management",
        "https://planet.lndo.site/blog/convert-every-store-visit-sale-endless-aisle",
        "https://planet.lndo.site/blog/payment-acceptance-rate",
        "https://planet.lndo.site/blog/payment-processing",
        "https://planet.lndo.site/de/blog/was-ist-die-zahlungsabwicklung",
        "https://planet.lndo.site/blog/most-popular-payment-methods-uk"
    ]

    // Initialize an empty array to store data for each URL
    const extractedData = [];

    for (const url of urls) {
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        try {
            console.log(`Extracting content from: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle' });

            // Get HTML content
            let content = await page.locator('.single-layout-canvas').innerHTML({ timeout: 15000 });
            content = content.replace(/[\n\t]/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\u00AD/g, '').replace(/>\s+</g, '><').trimStart();

            // Extract language from the URL
            const langMatch = url.match(/\/([a-z]{2})\//);
            const lang = langMatch ? langMatch[1] : 'en'; // default to 'en' if no language in URL

            // Extract node ID if available
            const blogElement = await page.locator('.plnt-blog-single-page');
            const classList = await blogElement.evaluate(el => Array.from(el.classList));
            const nodeIdClass = classList.find(cls => cls.startsWith('node-id-'));
            const nid = nodeIdClass ? nodeIdClass.replace('node-id-', '') : null;

            // Add extracted data to the array
            extractedData.push({
                url,
                lang,
                nid,
                html: content,
            });

            console.log(`Content extracted, cleaned, and saved for URL: ${url}`);
        } catch (error) {
            console.error(`Failed to retrieve content for ${url}: ${error.message}`);

            // Handle error by adding an entry with an error message
            extractedData.push({
                url,
                html: "Failed to retrieve content",
                lang: null,
                nid: null
            });
        }

        await page.close();
    }

    // Write all data to JSON file at the end
    fs.writeFileSync('url_content_mapping.json', JSON.stringify(extractedData, null, 2));
    console.log('Content extraction and saving completed.');
});
