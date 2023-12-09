import {Species} from "@/models/Species";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
      res.json(await Species.find());
  }

//   if (method === 'POST') {
//     const SpeciesDoc = await Species.create(req.body);
//     res.json(SpeciesDoc);
//   }

//   if (method === 'PUT') {
//     const {_id,...data} = req.body;
//     await Species.updateOne({_id},data);
//     res.json(true);
//   }

//   if (method === 'DELETE') {
//     if (req.query?.id) {
//       await Species.deleteOne({_id:req.query?.id});
//       res.json(true);
//     }
//   }



}