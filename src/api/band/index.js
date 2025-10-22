import Router from "koa-router";
import * as bandCtrl from "./band.ctrl.js";
import checkLoggedIn from "../../lib/checkLogin.js";

const band = new Router();

band.get("/", bandCtrl.list);
band.post("/", checkLoggedIn, bandCtrl.write);
band.get("/:id", bandCtrl.getMemberById, bandCtrl.read);
band.delete(
  "/:id",
  checkLoggedIn,
  bandCtrl.getMemberById,
  bandCtrl.checkOwnMember,
  bandCtrl.remove
);
band.patch(
  "/:id",
  checkLoggedIn,
  bandCtrl.getMemberById,
  bandCtrl.checkOwnMember,
  bandCtrl.update
);

export default band;
