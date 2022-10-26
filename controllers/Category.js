const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const response = await Category.findAll();
    res.status(200).json({
      categories: response,
      total_data: response.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const response = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const name = req.body.name;
  try {
    const category = await Category.create({ name: name });
    res.status(201).json({
      message: "Category Created Successfuly",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const category = await Category.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!category) return res.status(404).json({ msg: "No Data Found" });

  const name = req.body.name;

  try {
    await Category.update(
      { name: name },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(201).json({ message: "Category Updated Successfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const category = await Category.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!category) return res.status(404).json({ message: "No Data Found" });

  try {
    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Category Deleted Successfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
