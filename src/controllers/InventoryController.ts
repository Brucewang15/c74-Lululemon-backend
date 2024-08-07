
import { NextFunction, Request, Response } from 'express'


class InventoryController {

    static index = (req: Request, res: Response) => {
        res.send("NOT IMPLEMENTED");
    }
  
    static item_detail = (req: Request, res: Response) => {
        var id = req.params.id
        //res.send("checking item" + id);
    
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({stock: {
            "10": 4,
            "M": 3,
        }}));
    }
}
  
export default InventoryController
  
