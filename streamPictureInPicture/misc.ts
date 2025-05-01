export interface ApplicationStream {
    streamType: string;
    guildId: string | null;
    channelId: string;
    ownerId: string;
}

export interface Stream extends ApplicationStream {
    state: string;
}

export interface StreamContextProps {
    appContext: string,
    className: string,
    config: {
        context: string;
    },
    context: string,
    exitFullscreen: Function,
    onHeightUpdate: Function,
    position: string,
    target: HTMLElement,
    stream: Stream,
    theme: string;
}