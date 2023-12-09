import {Species} from "@/models/Species";
import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions, isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    res.json(await Species.find());
  }

  if (method === 'POST') {
    const {name,type} = req.body;
    const SpeciesDoc = await Species.create({
      name,type
    });
    res.json(SpeciesDoc);
  }

  if (method === 'PUT') {
    const {name} = req.body;
    const SpeciesDoc = await Species.updateOne({_id},{
      name,
    });
    res.json(SpeciesDoc);
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Species.deleteOne({_id});
    res.json('ok');
  }
}