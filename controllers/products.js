const product = require("../models/product")
const Product = require("../models/product")

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort("name price")
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
  const queryObject = {}

  if (featured) {
    queryObject.featured = featured === "true" ? true : false
  }

  if (company) {
    queryObject.company = company
  }

  if (name) {
    queryObject.name = name
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    }

    const regEx = /\b(>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )

    console.log(filters)
    const options = ["price", "rating"]
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-")
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }

  let page = Number(req.query.page) || 1
  let limit = Number(req.query.limit) || 10
  let skip = (page - 1) * limit

  let result = Product.find(queryObject)
  result = result.skip(skip).limit(limit)

  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ")
    result = result.sort(sortList)
  } else {
    result = result.sort("createdAt")
  }

  const products = await result

  res.status(200).json({ products, nbHits: products.length })
}

module.exports = { getAllProductsStatic, getAllProducts }

/*

// queryObject is like
{
  featured: true,
  company: "Apple",
  name: "iPhone",
  price: { $gt: 1000 },
  rating: { $gte: 4 }
}

 */
