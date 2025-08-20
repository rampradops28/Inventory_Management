import db from "../lib/db.js";

/**
 * audit(action, entity) -> middleware that writes an activity log after response finishes
 */
export const audit = (action, entity = null) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      try {
        // only log state-changing successful requests (2xx/201/204)
        if (res.statusCode < 200 || res.statusCode >= 300) return;
        const userId = req.user?.id || null;
        const metadata = {
          method: req.method,
          path: req.originalUrl,
          body: req.body,
          query: req.query,
          params: req.params
        };
        await db.query(
          "INSERT INTO activity_logs (user_id, action, entity, metadata, ip, user_agent) VALUES (?,?,?,?,?,?)",
          [
            userId,
            action,
            entity,
            JSON.stringify(metadata),
            req.ip || null,
            req.headers["user-agent"] || null
          ]
        );
      } catch (e) {
        console.error("Audit error:", e.message);
      }
    });
    next();
  };
};
