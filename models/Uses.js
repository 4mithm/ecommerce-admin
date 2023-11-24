import mongoose, {model, models, Schema} from "mongoose";

const UsesSchema= new Schema({
  name: {type:String,required:true},
});

export const Uses = models?.Uses || model('Uses', UsesSchema);