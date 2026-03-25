import dashboardService from "./dashboard.service.js";
import errorMiddleware from "../../middlewares/error.middleware.js";

const dashboardController = {
  getStats: async (req, res) => {
    try {
      const stats = await dashboardService.getStats();

      res.status(200).json({
        message: "Estadísticas del dashboard",
        ...stats,
      });
    } catch (error) {
      errorMiddleware.e500(
        res,
        "Error al obtener estadísticas del dashboard",
        error,
      );
    }
  },
};

export default dashboardController;
