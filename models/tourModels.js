const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      trim: true,
      minlength: [10, "A tour name must have greater or equal to 10 charecter"],
      maxlength: [40, "A tour name must have less or equal to 40 charecter "],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A Tour must have a duration!"],
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "difficult"],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating average must be greater or equal to 1"],
      max: [5, "Rating average must be less or equal to 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "price discount must be less then price",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`query time : ${Date.now() - this.start} ms`);
  next();
});

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
