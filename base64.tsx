import { ApplicationCommandInputType, ApplicationCommandOptionType, findOption, sendBotMessage } from "@api/Commands";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { FluxDispatcher } from "@webpack/common";
import { addContextMenuPatch, findGroupChildrenByChildId, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";
import { Menu } from "@webpack/common";
import { Clipboard, Toasts } from "@webpack/common";

// Borrowed from SpotifyShareCommands

const MessageCreator = findByPropsLazy("getSendMessageOptionsForReply", "sendMessage");
const PendingReplyStore = findByPropsLazy("getPendingReply");

function sendMessage(channelId, message) {
    message = {
        invalidEmojis: [],
        tts: false,
        validNonShortcutEmojis: [],
        ...message
    };
    const reply = PendingReplyStore.getPendingReply(channelId);
    MessageCreator.sendMessage(channelId, message, void 0, MessageCreator.getSendMessageOptionsForReply(reply))
        .then(() => {
            if (reply) {
                FluxDispatcher.dispatch({ type: "DELETE_PENDING_REPLY", channelId });
            }
        });
}

function b64Handler(content: string, method: string) {
    var clipboard = true;
    if (!Clipboard.SUPPORTS_COPY)
        clipboard = false;    

    var message = "Message is not a text message";
    var status = Toasts.Type.FAILURE;
    var invalid = false;

    if (content.length == 0) {
        Toasts.show({
            message: message,
            id: Toasts.genId(),
            type: status
        });
    } else {
        var out;

        try {
            if (method == "encode") out = btoa(content); else out = atob(content);
        } catch {
            invalid = true;
        }

        if (clipboard) {
            Clipboard.copy(out);
            message = "Copied to clipboard";
            status = Toasts.Type.SUCCESS;
        } else {
            message = "Clipboard unsupported";
        }

        if (invalid) {
            message = "Invalid Base64";
            status = Toasts.Type.FAILURE;
        }

        Toasts.show({
            message: message,
            id: Toasts.genId(),
            type: status
        });
    }
}

const MessageContext : NavContextMenuPatchCallback = (children, props) => () => {
    children.push(
        <Menu.MenuItem
            id = "base64-popout-menu"
            label = "Base64"
        >
            <Menu.MenuItem
                id = "base64-encode"
                label = "Encode"
                action = { () => b64Handler(props.message.content, "encode") }
            />
            <Menu.MenuItem
                id = "base64-decode"
                label = "Decode"
                action = { () => b64Handler(props.message.content, "decode") }
            />
        </Menu.MenuItem>
    );
}

export default definePlugin({
    name: "Base64",
    description: "Base64 utilities.",
    authors: [{
        id: 483646127942533121n,
        name: "Deltara"
    }],
    start() { addContextMenuPatch("message", MessageContext) },
    stop() { removeContextMenuPatch("message", MessageContext) },
    dependencies: ["CommandsAPI"],
    commands: [
        {
            name: "b64encode",
            description: "Encodes a selected string",
            inputType: ApplicationCommandInputType.BUILT_IN,
            options: [
                {
                    name: "content",
                    description: "Desired content to encode",
                    type: ApplicationCommandOptionType.STRING,
                    required: true
                },
                {
                    name: "send",
                    description: "Toggle sending, default false",
                    type: ApplicationCommandOptionType.BOOLEAN,
                    required: false
                }
            ],
            execute: async (_, ctx) => {
                var send = findOption(_, "send", "");
                let encoded = btoa(findOption(_, "content", ""));
                if (send) {
                    sendMessage(ctx.channel.id, {
                        content: encoded
                    });
                } else {
                    sendBotMessage(ctx.channel.id, {
                        content: encoded
                    });
                }
            }
        },
        {
            name: "b64decode",
            description: "Decodes a selected string",
            inputType: ApplicationCommandInputType.BUILT_IN,
            options: [
                {
                    name: "content",
                    description: "Desired content to decode",
                    type: ApplicationCommandOptionType.STRING,
                    required: true
                },
                {
                    name: "send",
                    description: "Toggle sending, default false",
                    type: ApplicationCommandOptionType.BOOLEAN,
                    required: false
                }
            ],
            execute: async (_, ctx) => {
                var send = findOption(_, "send", "");
                let decoded = atob(findOption(_, "content", ""));
                if (send) {
                    sendMessage(ctx.channel.id, {
                        content: decoded
                    });
                } else {
                    sendBotMessage(ctx.channel.id, {
                        content: decoded
                    });
                }
            }
        }

    ]
});
