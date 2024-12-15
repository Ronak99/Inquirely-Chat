import Message from "../types/message";

type Props = {
  message: Message;
};

const SystemBubble = ({ message }: Props) => {
  return (
    <div key={message.id} className={`flex justify-start`}>
      <div
        className={
          "max-w-[80%] rounded-lg px-3 py-1.5 bg-gray-100 border text-black text-xs shadow-sm shadow-gray-200"
        }
      >
        {message.content}
      </div>
    </div>
  );
};

export default SystemBubble;
