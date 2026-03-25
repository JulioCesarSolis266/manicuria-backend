import sDashboard from "./dashboard.service.js";
import mError from "../../middlewares/error.middleware.js";

const dashboardController = {
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

export default dashboardController;
