const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users", // Reference to the UserModel
      required: [true, "User reference is required"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "products", // Reference to the ProductModel
      required: [true, "Product reference is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment content is required"],
      minLength: [2, "Comment must be at least 2 characters long"],
      maxLength: [500, "Comment can be up to 500 characters long"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"], // More descriptive status
      default: "pending",
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Update the `updatedAt` field before saving
CommentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CommentModel = model("comments", CommentSchema);
module.exports = CommentModel;
