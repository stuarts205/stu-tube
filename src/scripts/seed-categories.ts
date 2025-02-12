import { db } from "@/db"
import { categories } from "@/db/schema"

const categoryNames = [
    "Cars & vehicles",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film & Animation",
    "Howto & Style",
    "Music",
    "News & Politics",
    "Prople & Blogs",
    "Pets & Animals",
    "Science & Technology",
    "Sports",
    "Travel & Events",
]

async function main(){
    console.log("Seeding categories...")

    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `Videos related to ${name.toLowerCase()}`
        }))

        await db.insert(categories).values(values)

        console.log("Categories seeded successfully!")

    } catch (error) {
        console.error("Error seeding categories", error)
        process.exit(1)
    }
}

main()