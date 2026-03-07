import sDashboard from "./sDashboard.js";
import mError from "../../middlewares/mError.js";

const cDashboard = {
  getStats: async (req, res) => {
    try {
      const stats = await sDashboard.getStats();

      res.status(200).json({
        message: "Estadísticas del dashboard",
        ...stats,
      });
    } catch (error) {
      mError.e500(res, "Error al obtener estadísticas del dashboard", error);
    }
  },
};

export default cDashboard;
