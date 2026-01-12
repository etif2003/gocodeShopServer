import express from "express";
import fs from "fs";
const port = 3000;
const app = express();

app.use(express.json());

app.get("/products", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync("./products.json", { encoding: "utf-8" })
  );
  console.log(products);
  res.send(products);
});

app.get("/products/id/:id", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync("./products.json", { encoding: "utf-8" })
  );
  const productById = products.find((product) => product.id === +req.params.id);
  console.log(productById);
  res.send(productById);
});

app.post("/products", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync("./products.json", { encoding: "utf-8" })
  );

  const maxId = products.length ? Math.max(...products.map((p) => p.id)) : 0;
  products.push({
    id: maxId + 1,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    rating: {
      rate: req.body.rating?.rate || 0,
      count: req.body.rating?.count || 0,
    },
  });
  fs.writeFileSync("./products.json", JSON.stringify(products), {
    encoding: "utf-8",
  });

  console.log(products);
  res.send(products);
});

app.delete("/products/id/:id", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync("./products.json", { encoding: "utf-8" })
  );
  const newProducts = products.filter(
    (product) => product.id !== +req.params.id
  );
  fs.writeFileSync("./products.json", JSON.stringify(newProducts), {
    encoding: "utf-8",
  });

  console.log(newProducts);
  res.send(newProducts);
});

//TODO: ADD VALIDATIONS
app.put("/products/id/:id", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync("./products.json", { encoding: "utf-8" })
  );
  const productById = products.find((product) => product.id === +req.params.id);

  if (!productById) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updates = { ...req.body };

  const invalidFields = Object.keys(updates).filter(
    (key) => !(key in productById)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      error: "Invalid fields in update: ",
      invalidFields,
    });
  }

  const updatedProducts = products.map((product) =>
    product.id === +req.params.id ? { ...product, ...updates } : product
  );

  fs.writeFileSync("products.json", JSON.stringify(updatedProducts), {
    encoding: "utf-8",
  });

  console.log({ ...productById, ...req.body });
  res.send({ ...productById, ...req.body });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
