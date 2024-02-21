const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 指定 SQLite 数据库文件路径
const dbPath = './music.db';

// 创建数据库连接
const db = new sqlite3.Database(dbPath);

// 设置 Express 中间件，以托管静态文件目录
app.use(express.static(__dirname));

// 使用 Express 中介軟體解析 JSON 格式的請求主體
app.use(express.json());

// admin
// mounted getYear
app.get('/api/year', (req, res) => {
  db.all(`select DISTINCT year from shortlist order by year desc`, function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.json(rows);
        // console.log(rows);
      }
    });
});
app.get('/api/awards', (req, res) => {
  db.all(`select awards from awards`, function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.json(rows);
      }
    });
});
// click year get awards
app.get('/api/year/:year', (req, res) => {
  const year = req.params.year;
  db.all(`select * from shortlist where year = '${year}' order by awards`, function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.json(rows);
        console.log(rows);
      }
    });
});
// click awards get shortlist
app.get('/api/shortlist/:year/:awards', (req, res) => {
  const year = req.params.year;
  const awards = req.params.awards;

  db.all(`SELECT * FROM shortlist WHERE year = '${year}' AND awards = '${awards}' ORDER BY awards`, function (err, rows) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});
app.delete('/api/shortlist/:year/:awards', (req, res) => {
  const year = req.params.year;
  const awards = req.params.awards;

  db.all(`Delete From shortlist  WHERE year = '${year}' AND awards = '${awards}' `, function (err, rows) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: `Internal Server Error: ${err.message}` });
    } else {
      res.json({ success: true, message: 'Item deleted successfully' });
    }
  });
});
// 處理插入資料的路由
app.post('/api/shortlist', (req, res) => {
  const newDataArray = req.body;

  // 假設您的 shortlist 表格結構如下：
  // awards, nominee, work, year, won, url
  const sql = 'INSERT INTO shortlist (awards, nominee, work, year, won, url) VALUES (?, ?, ?, ?, ?, ?)';

  // 使用 Promise.all 等待所有 INSERT 完成
  Promise.all(newDataArray.map(newData => {
    return new Promise((resolve, reject) => {
      db.run(sql, [
        newData.awards,
        newData.nominee,
        newData.work,
        newData.year,
        newData.won,
        newData.url
      ], function (err) {
        if (err) {
          console.error(err.message);
          reject(`Error inserting data: ${err.message}`);
        } else {
          console.log(`Row inserted with ID: ${this.lastID}`);
          resolve();
        }
      });
    });
  }))
    .then(() => {
      res.json({ success: true, message: 'Data inserted successfully' });
    })
    .catch(error => {
      res.status(500).json({ success: false, message: error });
    });
});
// 更新提名者
app.put('/api/shortlist/update', (req, res) => {
  const { year, awards, nominee, work } = req.body;

  // 假設你的資料庫是 SQLite，這裡的語法可能需要根據你的資料庫類型進行調整
  const sql = `
    BEGIN TRANSACTION;
    UPDATE shortlist 
    SET won = 0
    WHERE year = ${year} AND awards = '${awards}';
  
    UPDATE shortlist 
    SET won = 1
    WHERE year = ${year} AND awards = '${awards}' AND nominee = '${nominee}' AND work = '${work}';
    COMMIT;
  `;

  db.exec(sql, function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true, message: 'Item updated successfully' });
    }
  });
});
// 
app.post('/api/shortlist/insertWon', (req, res) => {
  const newDataArray = req.body;
  const sql = `
    INSERT INTO shortlist (awards, nominee, work, year, won, url) 
    VALUES ('年度歌曲獎', 'nominee', 'work', ${newDataArray[0].year}, 1, '')`;

  // 使用 SQLite3 的 db.run 方法执行 SQL INSERT 语句
  db.run(sql, function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Error inserting data' });
    } else {
      console.log(`Row inserted with ID: ${this.lastID}`);
      res.json({ success: true, message: 'Data inserted successfully' });
    }
  });
});



// 可以匹配 /api/tables/users
app.get('/api/tables/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  db.all(`SELECT * FROM ${tableName}`, function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        // 输出查询结果
        res.json(rows);
        console.log(rows);
      }
    
      // 关闭数据库连接
      // db.close();
    });
  const data = {
    tableName:tableName
  }
});

// 设置端点以提供表格数据
app.get('/api/tables', (req, res) => {
  // 获取所有表的列表
  db.all("SELECT name FROM sqlite_master WHERE type='table'", function (err, tables) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 对每个表执行查询，并将数据组织成 JSON 格式
      const tableData = tables.map(table => {
        const tableName = table.name;
        const query = `SELECT * FROM ${tableName}`;
        return new Promise((resolve, reject) => {
          db.all(query, (err, rows) => {
            if (err) {
              console.error(`Error querying table ${tableName}: ${err.message}`);
              reject(err);
            } else {
              resolve({ name: tableName, rows });
            }
          });
        });
      });

      // 等待所有查询完成后，将数据发送回客户端
      Promise.all(tableData)
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal Server Error' });
        });
    }
  });
});

// app.get('/api/tables/:tableName', (req, res) => {
//   const tableName = req.params.tableName;
//   res.send(tableName);
//   // 查询数据
//   // db.all(`SELECT * FROM ${tableName}`, function (err, rows) {
//   // if (err) {
//   //   console.error(err.message);
//   // } else {
//   //   // 输出查询结果
//   //   res.json(rows);
//   //   console.log(rows);
//   // }

//   // 关闭数据库连接
//   // db.close();
// // });
// });
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
