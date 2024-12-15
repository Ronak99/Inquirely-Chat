import Message from "../types/message";

type Props = {
  message: Message;
  primaryColor: string;
};

const UserBubble = ({ message, primaryColor }: Props) => {
  return (
    <div key={message.id} className={`flex justify-end`}>
      <div
        style={{ backgroundColor: primaryColor }}
        className={
          "max-w-[80%] rounded-lg px-3 py-1.5 text-white-800 text-xs shadow-sm shadow-indigo-500/50"
        }
      >
        {message.content}
      </div>
    </div>
  );
};

export default UserBubble;
