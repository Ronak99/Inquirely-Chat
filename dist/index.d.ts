import * as react_jsx_runtime from 'react/jsx-runtime';

interface Message {
    id: string;
    content: string;
    sender: "user" | "system";
    timestamp: Date;
}

interface ChatWidgetProps {
    initialMessages?: Message[];
    onSendMessage?: (message: string) => void;
    primaryColor?: string;
    folderId: string;
}
declare const ChatWidget: ({ initialMessages, onSendMessage, primaryColor, folderId, }: ChatWidgetProps) => react_jsx_runtime.JSX.Element;

export { ChatWidget as default };
