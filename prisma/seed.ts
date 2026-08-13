import { prisma } from "@/lib/prisma";

const companies = [
    {
        name: "Tata Consultancy Services",
        slug: "tata-consultancy-services",
        websiteUrl: "https://www.tcs.com",
    },
    {
        name: "Infosys",
        slug: "infosys",
        websiteUrl: "https://www.infosys.com",
    },
    {
        name: "Wipro",
        slug: "wipro",
        websiteUrl: "https://www.wipro.com",
    },
    {
        name: "Accenture",
        slug: "accenture",
        websiteUrl: "https://www.accenture.com",
    },
    {
        name: "Deloitte",
        slug: "deloitte",
        websiteUrl: "https://www.deloitte.com",
    },
    {
        name: "Cognizant",
        slug: "cognizant",
        websiteUrl: "https://www.cognizant.com",
    },
    {
        name: "HCLTech",
        slug: "hcltech",
        websiteUrl: "https://www.hcltech.com",
    },
    {
        name: "Tech Mahindra",
        slug: "tech-mahindra",
        websiteUrl: "https://www.techmahindra.com",
    },
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