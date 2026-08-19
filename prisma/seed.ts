import { prisma } from "@/lib/prisma";

const LOGO_TOKEN = "live_6a1a28fd-6420-4492-aeb0-b297461d9de2";

const companies = [
    {
        name: "Einfochips",
        slug: "einfochips",
        websiteUrl: "https://www.einfochips.com",
        logoUrl: `https://img.logo.dev/einfochips.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Webelight",
        slug: "webelight",
        websiteUrl: "https://www.webelight.com",
        logoUrl: `https://img.logo.dev/webelight.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "E2M Solutions",
        slug: "e2m-solutions",
        websiteUrl: "https://www.e2msolutions.com",
        logoUrl: `https://img.logo.dev/e2msolutions.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Odysseus Solutions",
        slug: "odysseus-solutions",
        websiteUrl: "https://www.odysseussolutions.com",
        logoUrl: `https://img.logo.dev/odysseussolutions.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "GNWebsoft",
        slug: "gnwebsoft",
        websiteUrl: "https://www.gnwebsoft.com",
        logoUrl: `https://img.logo.dev/gnwebsoft.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Armakuni",
        slug: "armakuni",
        websiteUrl: "https://www.armakuni.com",
        logoUrl: `https://img.logo.dev/armakuni.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Incubyte",
        slug: "incubyte",
        websiteUrl: "https://www.incubyte.co",
        logoUrl: `https://img.logo.dev/incubyte.co?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Synoverge Technologies",
        slug: "synoverge-technologies",
        websiteUrl: "https://www.synoverge.com",
        logoUrl: `https://img.logo.dev/synoverge.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Kody Technolab",
        slug: "kody-technolab",
        websiteUrl: "https://www.kodytechnolab.com",
        logoUrl: `https://img.logo.dev/kodytechnolab.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Simform",
        slug: "simform",
        websiteUrl: "https://www.simform.com",
        logoUrl: `https://img.logo.dev/simform.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Conneqtion Group",
        slug: "conneqtion-group",
        websiteUrl: "https://www.conneqtiongroup.com",
        logoUrl: `https://img.logo.dev/conneqtiongroup.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Memighty",
        slug: "memighty",
        websiteUrl: "https://www.memighty.com",
        logoUrl: `https://img.logo.dev/memighty.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Tuvoc Technologies",
        slug: "tuvoc-technologies",
        websiteUrl: "https://www.tuvoc.com",
        logoUrl: `https://img.logo.dev/tuvoc.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Intellytics Solutions",
        slug: "intellytics-solutions",
        websiteUrl: "https://www.intellyticssolutions.com",
        logoUrl: `https://img.logo.dev/intellyticssolutions.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "KenexAI",
        slug: "kenexai",
        websiteUrl: "https://www.kenexai.com",
        logoUrl: `https://img.logo.dev/kenexai.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Medkart Pharmacy",
        slug: "medkart-pharmacy",
        websiteUrl: "https://www.medkart.in",
        logoUrl: `https://img.logo.dev/medkart.in?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "MLVeda",
        slug: "mlveda",
        websiteUrl: "https://www.mlveda.com",
        logoUrl: `https://img.logo.dev/mlveda.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Meditab",
        slug: "meditab",
        websiteUrl: "https://www.meditab.com",
        logoUrl: `https://img.logo.dev/meditab.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Equilym Technologies",
        slug: "equilym-technologies",
        websiteUrl: "https://www.equilym.com",
        logoUrl: `https://img.logo.dev/equilym.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "GKN Aerospace",
        slug: "gkn-aerospace",
        websiteUrl: "https://www.gknaerospace.com",
        logoUrl: `https://img.logo.dev/gknaerospace.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Playpower Labs",
        slug: "playpower-labs",
        websiteUrl: "https://www.playpowerlabs.com",
        logoUrl: `https://img.logo.dev/playpowerlabs.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Finlogic Technologies",
        slug: "finlogic-technologies",
        websiteUrl: "https://www.njtechnologies.in",
        logoUrl: `https://img.logo.dev/njtechnologies.in?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "Maruti Techlabs",
        slug: "maruti-techlabs",
        websiteUrl: "https://www.marutitech.com",
        logoUrl: `https://img.logo.dev/marutitech.com?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    },
    {
        name: "FXIS.AI",
        slug: "fxis-ai",
        websiteUrl: "https://www.fxis.ai",
        logoUrl: `https://img.logo.dev/fxis.ai?token=${LOGO_TOKEN}&size=128&retina=true&format=png`,
    }
];

async function main() {
    for (const company of companies) {
        await prisma.company.upsert({
            where: {
                slug: company.slug,
            },
            update: company,
            create: company,
        });
    }

    console.log("Companies seeded successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });