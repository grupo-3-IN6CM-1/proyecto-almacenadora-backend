import Product from '../product/product.model.js';
import Kardex  from '../kardex/kardex.model.js';

export const getStats = async (req, res) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7*24*60*60*1000);

    const movs = await Kardex.aggregate([
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          entries: { $sum: { $cond: [{ $eq: ["$action","entry"] }, "$quantity", 0] } },
          exits:   { $sum: { $cond: [{ $eq: ["$action","exit"]  }, "$quantity", 0] } }
      }},
      { $sort: { "_id": 1 } }
    ]);

    const salesByProduct = await Kardex.aggregate([
      { $match: { action: "exit" } },
      { $group: { _id: "$product", totalSold: { $sum: "$quantity" } } },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "prod"
      }},
      { $unwind: "$prod" },
      { $project: {
          _id:       0,
          product:   "$prod.name",
          totalSold: 1
      }},
      { $sort: { totalSold: -1 } }
    ]);

    return res.json({
      productSales:     salesByProduct,    
      productMovements: movs.map(m => ({
        date:    m._id,
        entries: m.entries,
        exits:   m.exits
      }))
    });
  } catch (err) {
    console.error("Error en getStats:", err);
    return res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};