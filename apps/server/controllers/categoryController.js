const catchAsync = require("../utils/catchAsync");

// MODELS
const CategoryModel = require("../models/CategoryModel");
const ProductModel = require("../models/ProductModel");
const { log } = require("winston");

// Define category keywords mapping
const categoryDefinitions = {
  Electronics: {
    description: "Electronic devices and accessories for everyday use",
    keywords: [
      "wireless",
      "gaming",
      "monitor",
      "electronic",
      "smart",
      "digital",
      "keyboard",
      "mouse",
      "speaker",
      "earbuds",
      "camera",
    ],
  },
  "Home Office": {
    description: "Everything you need for a productive home office setup",
    keywords: ["office", "desk", "chair", "organizer", "cable", "laptop"],
  },
  "Fitness & Wellness": {
    description: "Products for health, fitness and personal wellness",
    keywords: [
      "fitness",
      "yoga",
      "dumbbell",
      "resistance",
      "health",
      "exercise",
    ],
  },
  "Kitchen & Dining": {
    description: "Kitchen appliances and accessories for cooking enthusiasts",
    keywords: ["blender", "coffee", "kettle", "food", "kitchen"],
  },
  "Smart Home": {
    description: "Smart devices to automate and secure your home",
    keywords: ["security", "camera", "smart", "purifier", "lock", "bulb"],
  },
  "Mobile Accessories": {
    description: "Accessories for smartphones and tablets",
    keywords: ["phone", "charger", "power bank", "charging"],
  },
};

exports.generateCategories = catchAsync(async (req, res, next) => {
  // Get all products
  const products = await ProductModel.find({});
  console.log(`Found ${products.length} products`);

  // Initialize categories with empty product arrays
  const categorizedProducts = {};
  Object.keys(categoryDefinitions).forEach((category) => {
    categorizedProducts[category] = [];
  });

  // Categorize products based on keywords
  products.forEach((product) => {
    const searchText = `${product.title} ${product.description}`.toLowerCase();

    Object.entries(categoryDefinitions).forEach(([category, definition]) => {
      const hasKeyword = definition.keywords.some((keyword) =>
        searchText.includes(keyword.toLowerCase())
      );

      if (hasKeyword) {
        categorizedProducts[category].push(product._id);
      }
    });
  });

  // Create category documents
  const categoryDocuments = Object.entries(categoryDefinitions).map(
    ([name, definition]) => ({
      name,
      description: definition.description,
      products: [...new Set(categorizedProducts[name])], // Remove duplicates
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  );

  // Remove any existing categories
  await CategoryModel.deleteMany({});

  // Insert new categories
  const insertedCategories = await CategoryModel.insertMany(
    categoryDocuments.filter((cat) => cat.products.length > 0) // Only insert categories with products
  );

  console.log(insertedCategories, "insertedCategories");

  const categories = await CategoryModel.create(insertedCategories);

  console.log("Categories created successfully!");
  console.log("\nCategory Statistics:");
  insertedCategories.forEach((category) => {
    console.log(`${category.name}: ${category.products.length} products`);
  });

  return res.status(200).json({
    message: "hello",
    categories,
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categoryCount = await CategoryModel.find({}).countDocuments();
  if (!categoryCount)
    return res.status(200).json({
      status: "success",
      message: "No categories to display",
      categories: [],
    });

  const categories = await CategoryModel.find({}).lean();
  log(categories, "Fetched categories");

  return res.status(200).json({
    status: "success",
    message: "List of all categories",
    categories,
  });
});

exports.getSingleCategory = catchAsync(async (req, res, next) => {
  //   console.log(req.params, "req.params.id");

  const category = await CategoryModel.findById(req.params.categoryID).lean();
  console.log(category, "category");

  if (!category)
    return res.status(404).json({
      status: "success",
      message: "No category to display",
      category: null,
    });

  return res.status(200).json({
    status: "success",
    message: "Single category",
    category,
  });
});
