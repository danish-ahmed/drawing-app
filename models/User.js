import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    average: {
      type: Number,
      required: false,
      default: 0,
    },
    images: [
      {
        type: new mongoose.Schema(
          {
            imageUri: String,
            aiFeedback: String,
            marks: Number,
          },
          { timestamps: true }
        ),
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
