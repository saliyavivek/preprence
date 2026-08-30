import { prisma } from "@/lib/prisma";

const skillsToSeed = [
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "C#",
    "React",
    "Next.js",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "Spring Boot",
    ".NET",
    "Django",
    "Flask",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "SQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git"
];

// Custom slugifier to preserve specific tech syntax
function generateSkillSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/\.net/g, 'dotnet') // .NET -> dotnet
        .replace(/\+/g, 'p')         // C++ -> cpp
        .replace(/#/g, 'sharp')      // C# -> csharp
        .replace(/[^a-z0-9]+/g, '-') // Replace other non-alphanumeric with dashes (e.g., Vue.js -> vue-js)
        .replace(/(^-|-$)+/g, '');   // Remove leading/trailing dashes
}

async function main() {
    console.log(`Seeding ${skillsToSeed.length} skills...`);

    for (const skillName of skillsToSeed) {
        const slug = generateSkillSlug(skillName);

        await prisma.skill.upsert({
            where: { slug: slug },
            update: { name: skillName },
            create: {
                name: skillName,
                slug: slug,
            },
        });
    }

    console.log("Skills seeded successfully.");
}

main()
    .catch((error) => {
        console.error("Error seeding skills:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });