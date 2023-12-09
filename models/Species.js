import mongoose, {model, models, Schema} from "mongoose";

const SpeciesSchema= new Schema({
  name: {type:String,required:true},
  type:{type:String,required:true}
});

export const Species = models?.Species || model('Species', SpeciesSchema);