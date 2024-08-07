
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
            "6": 1,
            "8": 2,
            "10": 4,
            "12": 2,
            "14": 1,
            "16": 1,
            "S": 2,
            "M": 3,
            "L": 2,
        }}));
    }
}
  
export default InventoryController
  
