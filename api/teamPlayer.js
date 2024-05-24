const { Router } = require("express");
const teamPlayerRouter = Router();
const { db, pgpHelpers } = require("../utils/database.js");

// Logging function
function _log(message) {
  console.log(`[TeamPlayer_API] - `, message);
}

// Common error handling middleware
function handleAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      _log(error.stack);
      res.status(500).json({ message: error.message });
    });
  };
}

// Database operations
async function insertTeamPlayer(data) {
  return await db.oneOrNone(
    pgpHelpers.insert(data, null, { table: "team" }) + " returning id"
  );
}

async function updateTeamPlayer(data) {
  return await db.oneOrNone(
    pgpHelpers.update(data, null, { table: "team" }) + " returning id"
  );
}

async function deleteTeamPlayerById(id) {
  return await db.oneOrNone(`delete from team where id = '${id}'`);
}

async function getAllTeamPlayer() {
  return await db.manyOrNone(`select * from team`);
}

// Routes
teamPlayerRouter.post(
  "/create",
  handleAsync(async (req, res) => {
    const data = req.body;
    const result = await insertTeamPlayer(data);
    res.status(200).json(result);
  })
);

teamPlayerRouter.put(
  "/update/:id",
  handleAsync(async (req, res) => {
    const data = req.body;
    let selectResult = await getAllTeamPlayer();
    Object.assign(selectResult, data);
    const result = await updatePlayer(data);
    res.status(200).json(result);
  })
);

teamPlayerRouter.put(
  "/delete/:id",
  handleAsync(async (req, res) => {
    const result = await deleteTeamPlayerById(req.params.id);
    res.status(200).json(result);
  })
);

teamPlayerRouter.get(
  "/",
  handleAsync(async (req, res) => {
    const result = await getAllTeamPlayer();
    res.status(200).json(result);
  })
);

module.exports = teamPlayerRouter;
