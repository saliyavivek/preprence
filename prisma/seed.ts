import { prisma } from "@/lib/prisma";

const rolesToSeed = [
    // Newly requested roles
    "Software Engineer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Data Scientist",
    "QA Engineer",
    "UI/UX Engineer",

    // Existing roles to ensure full coverage 
    "Java Developer",
    "Python Developer",
    "Prime Role",
    "Machine Learning Engineer",
    "Devops Engineer",
    "Frontend Developer",
];

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

async function main() {
    console.log(`Seeding ${rolesToSeed.length} roles...`);

    for (const title of rolesToSeed) {
        const slug = slugify(title);

        // upsert ensures that if the slug already exists, it ignores the creation, 
        // preventing duplicate errors when running the seed script multiple times.
        await prisma.role.upsert({
            where: {
                slug: slug
            },
            update: {
                name: title
            },
            create: {
                name: title,
                slug: slug,
            },
        });
    }

    console.log("Roles seeded successfully.");
}

main()
    .catch((error) => {
        console.error("Error seeding roles:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });