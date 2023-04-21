export interface DiscordEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

export interface DiscordEmbed {
    title: string;
    color?: number;
    thumbnail?: {
        url: string;
    };
    fields: DiscordEmbedField[];
}

export interface DiscordWebhook {
    content?: string;
    username?: string;
    avatar_url?: string;
    tts?: boolean;
    embeds?: DiscordEmbed[];
    allowed_mentions?: {
        parse?: string[];
        roles?: string[];
        users?: string[];
        replied_user?: boolean;
    };
    components?: any[];
    files?: Buffer[];
    payload_json?: string;
    attachments?: {
        name: string;
        description: string;
        file: Buffer;
    }[];
    flags?: number;
    thread_name?: string;
}
