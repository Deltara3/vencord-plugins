import {
    NavContextMenuPatchCallback,
    findGroupChildrenByChildId
} from "@api/ContextMenu";
import { Menu } from "@webpack/common";
import { StreamContextProps } from "./misc";
import { settings } from "./settings";

function findChildByClassInclude(element: HTMLElement, include: string): HTMLElement | undefined {
    const children = Array.from(element.children);
    return children.find((sub) => sub.className.includes(include)) as HTMLElement | undefined;
}

function findVideoElement(props: StreamContextProps): HTMLVideoElement | undefined {
    const targetParent = props.target.parentElement; 
    if (!targetParent) return undefined;
    
    const videoWrapper = findChildByClassInclude(targetParent, "videoWrapper");
    if (!videoWrapper) return undefined;

    const engineVideo = findChildByClassInclude(videoWrapper, "media-engine-video");
    return engineVideo?.getElementsByTagName("video")[0];
}

export const StreamContext: NavContextMenuPatchCallback = (children, props: StreamContextProps) => {
    const group = findGroupChildrenByChildId("watch", children);
    const video = findVideoElement(props);

    if (!video) return;

    const { isPictureInPicture } = settings.use(["isPictureInPicture"]);
    
    group?.push(
        <Menu.MenuCheckboxItem
            id = "toggle-pip"
            label = "Picture in Picture"
            checked = { isPictureInPicture! }
            action = { () => {
                if (document.pictureInPictureElement == null) {
                    video.requestPictureInPicture();
                } else {
                    document.exitPictureInPicture();
                }
            }}
        />
    );
};
