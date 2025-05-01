import definePlugin, { StartAt } from "@utils/types";
import { StreamContext } from "./menu";
import { settings } from "./settings"

export default definePlugin({
   name: "StreamPictureInPicture",
   description: "Adds picture in picture to screen shares",
   authors: [{
      name: "Deltara",
      id: 483646127942533121n
   }],
   settings: settings,
   contextMenus: {
      "stream-context": StreamContext
   },
   startAt: StartAt.WebpackReady,
   start() {
      settings.store.isPictureInPicture = document.pictureInPictureElement != null;
      window.addEventListener("enterpictureinpicture", this.enter);
      window.addEventListener("leavepictureinpicture", this.leave);
   },
   stop() {
      settings.store.isPictureInPicture = false;
      window.removeEventListener("enterpictureinpicture", this.enter);
      window.removeEventListener("leavepictureinpicture", this.leave);
   },
   enter() {
      settings.store.isPictureInPicture = true;
   },
   leave() {
      settings.store.isPictureInPicture = false;
   }
});
