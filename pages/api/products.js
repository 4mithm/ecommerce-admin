import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({_id:req.query.id}));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === 'POST') {
    const productDoc = await Product.create(req.body);
    res.json(productDoc);
  }

  if (method === 'PUT') {
    const {_id,...data} = req.body;
    await Product.updateOne({_id},data);
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}