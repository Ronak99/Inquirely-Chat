"use client";

import React from "react";
import ChatWidget from "../components/chat-widget";

export default function Page() {
  // The ID of this project
  const wanderon_project = "58574c72-5b43-41cc-82b9-cae846a8fbd7";

  // The ID of this folder
  const kashmir_folder = "fb700838-32c9-4cb2-b27f-5e08ef26e38d";

  // A custom session key or user ID to retrieve chats of your user
  const threadId = "custom-user-id";

  return (
    <ChatWidget
      projectId={wanderon_project}
      folderId={kashmir_folder}
      threadId={threadId}
    />
  );
}
