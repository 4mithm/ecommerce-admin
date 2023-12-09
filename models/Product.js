import mongoose, {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
  species: {type:String, required:true},
  type:{type:String, required:true},
  description: String,
  price: {type: Number, required: true},
  images: [{type:String}],
  cut:{type:String, required:true},
  measurement:{type:String,required:true},
  use:{type:String, required:true},
  dimensions:{type:Array, of:Array},
  maxLength:Number,
  maxWidth:Number,
  maxThickness:Number,
  minLength:Number,
  minWidth:Number,
  minThickness:Number

}, {
  timestamps: true, 
});

export const Product = models.Product || model('Product', ProductSchema);






// category: {type:mongoose.Types.ObjectId, ref:'Category'},
// properties: {type:Object},