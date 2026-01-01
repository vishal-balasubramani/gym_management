import pool from '../config/database.js'; // Ensure this path is correct

const checkFeature = (requiredFeature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; 

      // 1. Fetch the user's active membership features
      // We join membership_plans to get the actual feature list string
      const result = await pool.query(`
        SELECT p.features 
        FROM memberships m
        JOIN membership_plans p ON m.plan_type = p.name
        WHERE m.user_id = $1 AND m.status = 'active'
      `, [userId]);

      // 2. If no active membership, block access
      if (result.rows.length === 0) {
        return res.status(403).json({ 
          msg: "Access Denied. No active membership found." 
        });
      }

      // 3. Clean and parse the features string (e.g., "Diet Plan, Workout Plan")
      const rawFeatures = result.rows[0].features || "";
      const featuresList = rawFeatures.split(',').map(f => f.trim().toLowerCase());
      
      // 4. Check if the required feature exists in their plan
      if (!featuresList.includes(requiredFeature.toLowerCase())) {
        return res.status(403).json({ 
          msg: `This feature (${requiredFeature}) is not included in your current plan.` 
        });
      }

      next(); // Success! Proceed to the controller.

    } catch (err) {
      console.error("MIDDLEWARE_ERROR:", err.message);
      res.status(500).json({ msg: "Server Error in feature verification." });
    }
  };
};

export default checkFeature;