import {Uses} from "@/models/Uses";
import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions, isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    res.json(await Uses.find());
  }

  if (method === 'POST') {
    const {name} = req.body;
    const UsesDoc = await Uses.create({
      name
    });
    res.json(UsesDoc);
  }

  if (method === 'PUT') {
    const {name} = req.body;
    const UsesDoc = await Uses.updateOne({_id},{
      name,
    });
    res.json(UsesDoc);
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Uses.deleteOne({_id});
    res.json('ok');
  }
}