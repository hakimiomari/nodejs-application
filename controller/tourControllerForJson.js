const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`id: ${val}`);
  const id = req.params.id * 1;
  if (id > tours.length - 1) {
    return res.status(404).json({
      status: "faild",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "faild",
      message: "Missing name or Price",
    });
  }
  next();
};

// getAll tours
exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: "success",
    request_time: req.requestTime,
    length: tours.length,
    data: {
      tours: tours,
    },
  });
};

// get Tour
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

// create tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          newTour,
        },
      });
    }
  );
};

// update tour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "updated current field",
  });
};

// delete tour
exports.deleteTour = (req, res) => {
  const newTours = tours.filter((el) => el.id !== id);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    (err) => {
      if (err) {
        res.status(404).json({
          status: "faild",
          message: "Your Edit not saved!",
        });
      }
      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );
};
