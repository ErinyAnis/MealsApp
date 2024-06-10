import fs from "node:fs";
import { promisify } from "util";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

const writeFile = promisify(fs.writeFile);

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // throw new Error('Loading meals failed');
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  try {
    // Generate slug and sanitize inputs
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    // Save image file
    const extension = meal.image.name.split(".").pop();
    const fileName = `${meal.slug}.${extension}`;
    const imagePath = `public/images/${fileName}`;

    const bufferedImage = await meal.image.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(bufferedImage));

    // Update meal object with image path
    meal.image = `/images/${fileName}`;

    // Insert meal data into the database
    const statement = db.prepare(`
      INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const { title, summary, instructions, creator, creator_email, image, slug } = meal;
    statement.run(title, summary, instructions, creator, creator_email, image, slug);

    return { success: true, message: "Meal saved successfully." };
  } catch (error) {
    console.error("Error saving meal:", error);
    return { success: false, message: "Failed to save meal." };
  }
}