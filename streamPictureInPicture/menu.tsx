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

function findVideoElement(props: StreamContextProps): HTMLVideoElement {
    const targetParent = props.target.parentElement!;
    const videoWrapper = findChildByClassInclude(targetParent, "videoWrapper")!;
    const engineVideo = findChildByClassInclude(videoWrapper, "media-engine-video")!;
    return engineVideo.getElementsByTagName("video")[0];
}

export const StreamContext: NavContextMenuPatchCallback = (children, props: StreamContextProps) => {
    const group = findGroupChildrenByChildId("watch", children)!;
    const video = findVideoElement(props)!;

    const { isPictureInPicture } = settings.use(["isPictureInPicture"]);
    
    group.push(
        <Menu.MenuCheckboxItem
            id = "toggle-pip"
            label = "Picture in Picture"
            checked = { isPictureInPicture }
            action = { () => {
                if (document.pictureInPictureElement == null) {
                    video.requestPictureInPicture().then(() => {
                        // settings.store.isPictureInPicture = true;
                    });
                } else {
                    document.exitPictureInPicture().then(() => {
                        // settings.store.isPictureInPicture = false;
                    });
                }
            }}
        />
    );
};
