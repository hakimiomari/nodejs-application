const Tour = require("../models/tourModels");
const APIFeatures = require("./../utiles/apiFeatures");
const catchAsync = require("../utiles/catchAsync");
const AppError = require("../utiles/AppError");

// alias middleWare
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};

exports.getAllTour = catchAsync(async (req, res, next) => {
  const ApiFeature = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .paginate();

  // Execute the Query
  const tours = await ApiFeature.query;
  res.status(200).json({
    status: "success",
    request_time: req.requestTime,
    length: tours.length,
    data: {
      tours,
    },
  });
});

// get Tour
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// create tour
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tours: newTour,
    },
  });
});

// update tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("Invalid ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "updated current field",
    tour: tour,
  });
});

// delete tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError(`No tour found with that ID`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.tourState = catchAsync(async (req, res, next) => {
  const state = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numDoc: { $sum: 1 },
        numQuan: { $sum: "$ratingQuantity" },
        AvgRating: { $avg: "$ratingAverage" },
        AvgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { AvgPrice: -1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    Avg: {
      state,
    },
  });
});

// monthly plan
exports.monthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}/01/01`),
          $lte: new Date(`${year}/12/31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTour: { $sum: 1 },
        name: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTour: -1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    length: plan.length,
    Avg: {
      plan,
    },
  });
});
