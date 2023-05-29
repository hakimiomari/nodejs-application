const express = require("express");
const router = express.Router();
const tourController = require("./../controller/tourController");

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTour);

router.route("/tour-state").get(tourController.tourState);
router.route("/monthly-plan/:year").get(tourController.monthlyPlan);

router
  .route("/")
  .get(tourController.getAllTour)
  .post(tourController.createTour);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
