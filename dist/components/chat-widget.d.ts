import Message from "../types/message";
interface ChatWidgetProps {
    initialMessages?: Message[];
    onSendMessage?: (message: string) => void;
    primaryColor?: string;
    folderId: string;
}
declare const ChatWidget: ({ initialMessages, onSendMessage, primaryColor, folderId, }: ChatWidgetProps) => import("react/jsx-runtime").JSX.Element;
export default ChatWidget;
