import { test } from '@playwright/test';
import fs from 'fs';

test.setTimeout(1200000);

test('extract content and store in JSON', async ({ browser }) => {
     const urls = [
        "https://planet.lndo.site/online-payments",
        "https://planet.lndo.site/in-person-payments",
        "https://planet.lndo.site/payments",
        "https://planet.lndo.site/hotel-pms",
        "https://planet.lndo.site/hotel-booking-engine",
        "https://planet.lndo.site/order-management-system",
        "https://planet.lndo.site/dcc",
        "https://planet.lndo.site/vat-refund",
        "https://planet.lndo.site/retail",
        "https://planet.lndo.site/hospitality",
        "https://planet.lndo.site/travel",
        "https://planet.lndo.site/partners",
        "https://planet.lndo.site/unified-commerce",
        "https://planet.lndo.site/hotel-networking",
        "https://planet.lndo.site/security-compliance-fraud",
        "https://planet.lndo.site/reconciliation",
        "https://planet.lndo.site/tokenisation",
        "https://planet.lndo.site/interactive-tv-hotels",
        "https://planet.lndo.site/pci-proxy",
        "https://planet.lndo.site/digital-signage",
        "https://planet.lndo.site/event-connectivity-manager",
        "https://planet.lndo.site/merchant-acquiring",
        "https://planet.lndo.site/internet-services",
        "https://planet.lndo.site/gift-cards",
        "https://planet.lndo.site/dashboard",
        "https://planet.lndo.site/click-and-collect",
        "https://planet.lndo.site/card-machines-terminals",
        "https://planet.lndo.site/mobile-payment-terminals",
        "https://planet.lndo.site/pay-by-link",
        "https://planet.lndo.site/terminals-unattended",
        "https://planet.lndo.site/terminals-countertop",
        "https://planet.lndo.site/in-app-payments",
        "https://planet.lndo.site/es/pagos-online",
        "https://planet.lndo.site/es/pagos-en-persona",
        "https://planet.lndo.site/es/pagos",
        "https://planet.lndo.site/es/hotel-pms",
        "https://planet.lndo.site/es/motor-reservas-hotel",
        "https://planet.lndo.site/es/sistema-omnicanal-gestion-pedidos",
        "https://planet.lndo.site/es/dcc",
        "https://planet.lndo.site/es/devolucion-iva",
        "https://planet.lndo.site/es/retail",
        "https://planet.lndo.site/es/hosteleria",
        "https://planet.lndo.site/es/viajes-transporte",
        "https://planet.lndo.site/es/partners",
        "https://planet.lndo.site/es/comercio-unificado",
        "https://planet.lndo.site/es/hotel-networking",
        "https://planet.lndo.site/es/seguridad-cumplimiento-fraude",
        "https://planet.lndo.site/es/servicio-de-conciliacion",
        "https://planet.lndo.site/es/tokenizacion",
        "https://planet.lndo.site/es/tv-interactiva-hoteles",
        "https://planet.lndo.site/es/cumplimiento-PCI",
        "https://planet.lndo.site/es/servicios-internet",
        "https://planet.lndo.site/es/tarjetas-regalo",
        "https://planet.lndo.site/es/panel-control",
        "https://planet.lndo.site/es/click-and-collect",
        "https://planet.lndo.site/es/lectores-de-tarjetas-terminales",
        "https://planet.lndo.site/es/terminales-pago-moviles",
        "https://planet.lndo.site/es/pay-by-link",
        "https://planet.lndo.site/es/terminales-pago-desatendido",
        "https://planet.lndo.site/es/terminales-fijos",
        "https://planet.lndo.site/es/pagos-in-app",
        "https://planet.lndo.site/fr/paiements-en-ligne",
        "https://planet.lndo.site/fr/paiements-magasin",
        "https://planet.lndo.site/fr/paiements",
        "https://planet.lndo.site/fr/hotel-pms",
        "https://planet.lndo.site/fr/moteurs-reservation-hotels",
        "https://planet.lndo.site/fr/order-management-system",
        "https://planet.lndo.site/fr/dcc",
        "https://planet.lndo.site/fr/remboursement-tva",
        "https://planet.lndo.site/fr/retail",
        "https://planet.lndo.site/fr/hospitalite",
        "https://planet.lndo.site/fr/voyage",
        "https://planet.lndo.site/fr/partners",
        "https://planet.lndo.site/fr/contact",
        "https://planet.lndo.site/fr/commerce-unifie",
        "https://planet.lndo.site/fr/hotel-networking",
        "https://planet.lndo.site/fr/securite-conformite-fraude",
        "https://planet.lndo.site/fr/reconciliation",
        "https://planet.lndo.site/fr/tokenisation",
        "https://planet.lndo.site/fr/television-interactive-pour-les-hotels",
        "https://planet.lndo.site/fr/pci-proxy",
        "https://planet.lndo.site/fr/acquisitions-marchand",
        "https://planet.lndo.site/fr/cartes-cadeaux",
        "https://planet.lndo.site/fr/tableau-de-bord",
        "https://planet.lndo.site/fr/click-collect",
        "https://planet.lndo.site/fr/machines-a-cartes",
        "https://planet.lndo.site/fr/terminaux-paiement-mobile",
        "https://planet.lndo.site/fr/pay-by-link",
        "https://planet.lndo.site/fr/terminaux-sans-surveillance",
        "https://planet.lndo.site/fr/terminaux-comptoir",
        "https://planet.lndo.site/fr/paiements-integres",
        "https://planet.lndo.site/it/pagamenti-online",
        "https://planet.lndo.site/it/pagamenti-di-persona",
        "https://planet.lndo.site/it/pagamenti",
        "https://planet.lndo.site/it/hotel-pms",
        "https://planet.lndo.site/it/sistemi-prenotazione-alberghiera",
        "https://planet.lndo.site/it/sistema-gestione-ordini-omnicanale",
        "https://planet.lndo.site/it/dcc",
        "https://planet.lndo.site/it/rimborso-iva",
        "https://planet.lndo.site/it/retail",
        "https://planet.lndo.site/it/hospitality",
        "https://planet.lndo.site/it/viaggio",
        "https://planet.lndo.site/it/partners",
        "https://planet.lndo.site/it/commercio-unificato",
        "https://planet.lndo.site/it/hotel-networking",
        "https://planet.lndo.site/it/sicurezza-conformita-frode",
        "https://planet.lndo.site/it/servizio-di-riconciliazione",
        "https://planet.lndo.site/it/tokenizzazione",
        "https://planet.lndo.site/it/tv-interattiva",
        "https://planet.lndo.site/it/pci-proxy",
        "https://planet.lndo.site/it/servizi-internet",
        "https://planet.lndo.site/it/gift-cards",
        "https://planet.lndo.site/it/dashboard",
        "https://planet.lndo.site/it/click-collect",
        "https://planet.lndo.site/it/lettori-e-terminali",
        "https://planet.lndo.site/it/terminali-pagamento-mobili",
        "https://planet.lndo.site/it/pay-by-link",
        "https://planet.lndo.site/it/terminali-non-presidiati",
        "https://planet.lndo.site/it/terminali-da-banco",
        "https://planet.lndo.site/it/pagamenti-in-app",
        "https://planet.lndo.site/de/online-zahlung",
        "https://planet.lndo.site/de/personliche-zahlungen",
        "https://planet.lndo.site/de/zahlungen",
        "https://planet.lndo.site/de/hotel-pms",
        "https://planet.lndo.site/de/hotelbuchungsmaschine",
        "https://planet.lndo.site/de/dcc",
        "https://planet.lndo.site/de/mehrwertsteuer-ruckerstattung",
        "https://planet.lndo.site/de/einzelhandel",
        "https://planet.lndo.site/de/hotel-und-gastgewerbe",
        "https://planet.lndo.site/de/reisen",
        "https://planet.lndo.site/de/partnerschaften",
        "https://planet.lndo.site/de/einheitlicher-handel",
        "https://planet.lndo.site/de/hotel-netzwerke",
        "https://planet.lndo.site/de/betrug-bei-der-einhaltung-von-sicherheitsvorschriften",
        "https://planet.lndo.site/de/reconciliation",
        "https://planet.lndo.site/de/tokenisation",
        "https://planet.lndo.site/de/interaktives-fernsehen-fuer-hotels",
        "https://planet.lndo.site/de/pci-proxy",
        "https://planet.lndo.site/de/merchant-acquiring",
        "https://planet.lndo.site/de/internetdienste",
        "https://planet.lndo.site/de/geschenkkarten",
        "https://planet.lndo.site/de/dashboard",
        "https://planet.lndo.site/de/click-and-collect",
        "https://planet.lndo.site/de/karten-terminals",
        "https://planet.lndo.site/de/mobile-zahlungsterminals",
        "https://planet.lndo.site/de/pay-by-link",
        "https://planet.lndo.site/de/terminals-unbeaufsichtigt",
        "https://planet.lndo.site/de/countertop-terminals",
        "https://planet.lndo.site/de/in-app-zahlungen"
    ];

    const extractedData = [];

    for (const url of urls) {
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        try {
            console.log(`Extracting content from: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle' });

            // Extract language from the URL
            const langMatch = url.match(/\/([a-z]{2})\//);
            const lang = langMatch ? langMatch[1] : 'en'; // default to 'en' if no language in URL

            // Extract node ID if available
            const articleElement = await page.locator('article').first();

            // Check and remove the webform-submission-form element if it exists
            if (await articleElement.locator('.webform-submission-form').count() > 0) {
                await page.evaluate(() => {
                    const article = document.querySelector('article');
                    if (article) {
                        const form = article.querySelector('.webform-submission-form');
                        if (form) {
                            form.remove();
                        }
                    }
                });
            }

            // Get HTML content
            let content = await page.locator('#block-cohesion-theme-content').innerHTML({ timeout: 150000 });
            content = content.replace(/[\n\t]/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\u00AD/g, '').replace(/>\s+</g, '><').trimStart();

            const nid = await articleElement.getAttribute('data-history-node-id');

            // Add extracted data to the array
            extractedData.push({
                url,
                lang,
                nid,
                html: content,
            });

            console.log(`Content and inline styles extracted for URL: ${url}`);
        } catch (error) {
            console.error(`Failed to retrieve content for ${url}: ${error.message}`);
            extractedData.push({
                url,
                html: "Failed to retrieve content",
                lang: null,
                nid: null,
            });
        }

        await page.close();
    }

    // Write all data to JSON file at the end
    fs.writeFileSync('product_pages_content_with_inline_styles.json', JSON.stringify(extractedData, null, 2));
    console.log('Content extraction and saving completed.');
});