import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import { Admin } from "./admin.model.js";

dotenv.config();

const ResidenceAddressSchema = new Schema(
    {
      address: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      zipcode: {
        type: String,
        required: false,
      },
    },
    { _id: false }
  );


const partnerTeamSchema = new Schema(
  {
    residenceAddress: {
        type: ResidenceAddressSchema,
        required: false,
    },
    
    teamId:{
      type: String,
      required: false,
    },

  },
  {
    timestamps: true,
  }
);

export const ParntnerTeamMember = Admin.discriminator("3", partnerTeamSchema);
