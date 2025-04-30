import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());

async function main() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "travel",
  });

  app.get("/api/attractions", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const sort_column = req.query.sort_column;
    const sort_direction = req.query.sort_direction || "asc";
    const search = req.query.search;

    const start_idx = (page - 1) * per_page;

    let whereClause = "";
    let params = [];
    if (search) {
      whereClause = " WHERE name LIKE ? ";
      params.push(`%${search}%`);
    }

    let sql = `SELECT * FROM attractions ${whereClause}`;
    if (sort_column) {
      sql += ` ORDER BY ${sort_column} ${sort_direction}`;
    }
    sql += " LIMIT ?, ?";
    params.push(start_idx, per_page);

    try {
      const [results] = await connection.execute(sql, params);

      // นับจำนวนรวมทั้งหมด
      const countSql = `SELECT COUNT(*) as total FROM attractions ${whereClause}`;
      const [countResult] = await connection.execute(
        countSql,
        search ? [`%${search}%`] : []
      );

      console.log(countResult[0].total);

      res.json({ results, total: countResult[0].total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.listen(5000, () => {
    console.log("Web server listening on port 5000");
  });
}

main();
