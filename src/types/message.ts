interface Message {
  id: string;
  content: string;
  sender: "user" | "system";
  timestamp: Date;
}

export default Message;
