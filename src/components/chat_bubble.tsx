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
      <div style={{ overflowX: "auto", margin: "1rem 0" }}>
        <table
          style={{
            minWidth: "100%",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
          }}
        >
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#111827",
                    borderBottom: "1px solid #d1d5db",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ borderTop: "1px solid #e5e7eb" }}>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ backgroundColor: "#ffffff" }}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      color: "#111827",
                      borderBottom: "1px solid #d1d5db",
                    }}
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
            <h3
              key={index}
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                margin: "1rem 0",
              }}
            >
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
              style={{
                margin: "0.5rem 0.5rem",
                listStyleType: "disc",
              }}
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
              style={{ margin: "0.5rem 0" }}
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
      style={{
        display: "flex",
        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
      }}
    >
      {message.content == "system_typing" ? (
        <div
          style={{
            maxWidth: "75%",
            borderRadius: "0.375rem",
            padding: "0.75rem",
            backgroundColor: "#d1d5db",
            color: "black",
            border: "1px solid #a3a3a3",
            borderTopLeftRadius: "0",
          }}
        >
          <BouncingDotsAnimation />
        </div>
      ) : (
        <div
          style={{
            maxWidth: "75%",
            borderRadius: "0.375rem",
            padding: "0.25rem 1rem 0.25rem 1rem",
            margin: "8px 0px 8px 0px",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            backgroundColor: message.role === "user" ? themeColor : "#d4d4d4",
            color: message.role === "user" ? "#d1d5db" : "black",
            border: message.role === "user" ? "none" : "1px solid #a3a3a3",
            borderBottomRightRadius: message.role === "user" ? "0" : "0.375rem",
            borderTopLeftRadius: message.role === "user" ? "0.375rem" : "0",
          }}
        >
          {formattedContent}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
