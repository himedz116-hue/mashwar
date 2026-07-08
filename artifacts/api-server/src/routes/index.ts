import { Router, type IRouter } from "express";
import healthRouter from "./health";
import plateLookupRouter from "./plate-lookup";

const router: IRouter = Router();

router.use(healthRouter);
router.use(plateLookupRouter);

export default router;
