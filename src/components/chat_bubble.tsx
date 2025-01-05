import React from "react";
import { useState, useEffect } from "react";
import { Message } from "../types/api";
import BouncingDotsAnimation from "./typing_anim";

interface FormatterProps {
  message: Message;
  themeColor: string;
}

const ChatBubble: React.FC<FormatterProps> = ({ message, themeColor }) => {
  const [formattedContent, setFormattedContent] = useState<React.ReactNode[]>(
    []
  );

  const parseTable = (tableContent: string) => {
    const lines = tableContent.trim().split("\n");
    if (lines.length < 3) return null;

    const headers = lines[0]
      .split("|")
      .slice(1, -1)
      .map((header) => header.trim());

    const rows = lines.slice(2).map((line) => {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) =>
          cell.trim().replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        );
      return cells;
    });

    return (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 text-sm text-gray-900 border-b"
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    const formatContent = () => {
      const lines = message.content.split("\n");
      const formatted: React.ReactNode[] = [];
      let tableContent: string[] = [];
      let isInTable = false;

      lines.forEach((line, index) => {
        // Check if line is part of a table
        if (line.trim().startsWith("|") || (isInTable && line.trim() !== "")) {
          tableContent.push(line);
          isInTable = true;

          // If next line is not part of table or this is the last line
          if (
            !lines[index + 1]?.trim().startsWith("|") ||
            index === lines.length - 1
          ) {
            const table = parseTable(tableContent.join("\n"));
            if (table) formatted.push(table);
            tableContent = [];
            isInTable = false;
          }
          return;
        }

        // Handle headers
        if (line.startsWith("###")) {
          formatted.push(
            <h3 key={index} className="text-xl font-bold my-4">
              {line.replace("###", "").trim()}
            </h3>
          );
          return;
        }

        // Handle bold text
        const boldText = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Handle bullet points
        if (line.trim().startsWith("-")) {
          formatted.push(
            <li
              key={index}
              className="ml-6 my-2 list-disc"
              dangerouslySetInnerHTML={{
                __html: boldText.replace("-", "").trim(),
              }}
            />
          );
          return;
        }

        // Regular paragraphs (if not empty)
        if (line.trim()) {
          formatted.push(
            <p
              key={index}
              className=""
              dangerouslySetInnerHTML={{
                __html: boldText,
              }}
            />
          );
        }
      });

      setFormattedContent(formatted);
    };

    formatContent();
  }, [message.content]);

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.content == "system_typing" ? (
        <div
          className={`max-w-[75%] rounded-md px-3 py-3 bg-neutral-300 text-black border border-neutral-400 rounded-tl-none`}
        >
          <BouncingDotsAnimation />
        </div>
      ) : (
        <div
          className={`prose max-w-[75%] rounded-md px-4 py-3 text-white-800 text-sm shadow-sm ${
            message.role === "user"
              ? `text-gray-300 rounded-br-none`
              : "text-black border border-neutral-400 rounded-tl-none"
          }`}
          style={{
            background: message.role === "user" ? themeColor : "#d4d4d4",
          }}
        >
          {message.content}
        </div>
      )}
    </div>
  );

  //   return (
  //     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
  //       <div className="prose">{formattedContent}</div>
  //     </div>
  //   );
};

export default ChatBubble;
