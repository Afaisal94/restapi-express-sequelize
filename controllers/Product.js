const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { Op } = require("sequelize");

// GET ALL
const getProducts = async (req, res) => {
  const name = req.query.name || "";
  const currentPage = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perpage) || 3;
  const offset = (currentPage - 1) * perPage;
  try {
    const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    const response = await Product.findAll({
      where: condition,
      attributes: ["id", "name", "price", "image", "imageUrl"],
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
            // where: { name: 'Sport' }
        },
      ],
      offset: offset,
      limit: perPage,
    });
    const totalData = await Product.findAll({where: condition});
    res.status(200).json({
      products: response,
      total_data: totalData.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      attributes: ["id", "name", "price", "image", "imageUrl"],
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ message: "No File Uploaded" });

  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ message: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ message: err.message });
    try {
      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        image: fileName,
        imageUrl: url,
        categoryId: req.body.categoryId,
      });
      res.status(201).json({
        message: "Product Created Successfuly",
        data: product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

const updateProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ message: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Image must be less than 5 MB" });

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ message: err.message });
    });
  }

  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Product.update(
      {
        name: req.body.name,
        price: req.body.price,
        image: fileName,
        imageUrl: url,
        categoryId: req.body.categoryId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(201).json({ message: "Product Updated Successfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ message: "No Data Found" });

  try {
    // Delete old image
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Product Deleted Successfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
