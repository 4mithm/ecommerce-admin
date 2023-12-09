// import mongoose, {model, models, Schema} from "mongoose";
// const { ObjectId } = Schema.Types;

// const PreplannedSchema = new Schema({
//   length: String,
//   width: String,
//   thickness: String
// }, {_id: false});

// const CutToSizeSchema = new Schema({
//   maxLength: Number,
//   maxWidth: Number,
//   maxThickness: Number,
//   minLength: Number,
//   minWidth: Number,
//   minThickness: Number
// }, {_id: false});

// const ProductSchema = new Schema({
//   species: {type: ObjectId, ref: 'Species'},
//   type:{type:String, required:true},
//   description: String,
//   price: {type: Number, required: true},
//   images: [{type:String}],
//   cut:{type:String, required:true},
//   measurement:{type:String,required:true},
//   use:{type:String, required:true},
//   preplanned: PreplannedSchema,
//   cutToSize: CutToSizeSchema
// }, {
//   timestamps: true, 
// });

// export const Product = models.Product || model('Product', ProductSchema);

// const SpeciesSchema= new Schema({
//   name: {type:String,required:true},
//   type:{type:String,required:true}
// });

// export const Species = models?.Species || model('Species', SpeciesSchema);


var arr= [];
// arr.push([10,20,30])
// arr.push([100,200,300])
// arr.push([22,33,45])
arr.forEach((element, index)=>{
  console.log(element.join("-"),index)
})