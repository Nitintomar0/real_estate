import mongoose, { Schema } from "mongoose";

export type VisitorInterestVisit = {
  clientVisitId?: string;
  activeDurationSeconds: number;
  visitedAt: Date;
};

export type VisitorContactActivity = {
  source: string;
  sourceLabel: string;
  submittedAt: Date;
  relatedPropertyId: string;
  relatedPropertyTitle: string;
  details: {
    city: string;
    email: string;
    message: string;
    preferredDate: string;
    leadType: string;
  };
};

export type VisitorInterestProperty = {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyUrl: string;
  visitCount: number;
  totalActiveTimeSeconds: number;
  visits: VisitorInterestVisit[];
};

export type VisitorInterestDocument = mongoose.Document & {
  name: string;
  phone: string;
  normalizedPhone: string;
  firstCapturedAt: Date;
  propertyHistory: VisitorInterestProperty[];
  contactActivities: VisitorContactActivity[];
};

const VisitSchema = new Schema<VisitorInterestVisit>(
  {
    clientVisitId: {
      type: String,
      default: "",
      trim: true,
    },
    activeDurationSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    visitedAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const ContactActivitySchema = new Schema<VisitorContactActivity>(
  {
    source: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sourceLabel: {
      type: String,
      required: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    relatedPropertyId: {
      type: String,
      default: "",
      trim: true,
    },
    relatedPropertyTitle: {
      type: String,
      default: "",
      trim: true,
    },
    details: {
      city: {
        type: String,
        default: "",
        trim: true,
      },
      email: {
        type: String,
        default: "",
        trim: true,
      },
      message: {
        type: String,
        default: "",
        trim: true,
      },
      preferredDate: {
        type: String,
        default: "",
        trim: true,
      },
      leadType: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  { _id: false }
);

const PropertyHistorySchema = new Schema<VisitorInterestProperty>(
  {
    propertyId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    propertyTitle: {
      type: String,
      required: true,
      trim: true,
    },
    propertyLocation: {
      type: String,
      default: "",
      trim: true,
    },
    propertyUrl: {
      type: String,
      default: "",
      trim: true,
    },
    visitCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalActiveTimeSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    visits: {
      type: [VisitSchema],
      default: [],
    },
  },
  { _id: false }
);

const VisitorInterestSchema = new Schema<VisitorInterestDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedPhone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    firstCapturedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    propertyHistory: {
      type: [PropertyHistorySchema],
      default: [],
    },
    contactActivities: {
      type: [ContactActivitySchema],
      default: [],
    },
  },
  { timestamps: true }
);

VisitorInterestSchema.index({ "propertyHistory.propertyId": 1 });
VisitorInterestSchema.index({ "contactActivities.source": 1 });
VisitorInterestSchema.index({ firstCapturedAt: -1 });

export default (mongoose.models.VisitorInterest as
  | mongoose.Model<VisitorInterestDocument>
  | undefined) ||
  mongoose.model<VisitorInterestDocument>(
    "VisitorInterest",
    VisitorInterestSchema
  );
