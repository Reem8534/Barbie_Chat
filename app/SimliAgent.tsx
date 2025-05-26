import React, { useRef, useState } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import VideoBox from "@/app/Components/VideoBox";
import cn from "./utils/TailwindMergeAndClsx";
import IconSparkleLoader from "@/media/IconSparkleLoader";

interface SimliAgentProps {
  onStart: () => void;
  onClose: () => void;
}

// Get your Simli API key from https://app.simli.com/
const SIMLI_API_KEY = process.env.NEXT_PUBLIC_SIMLI_API_KEY;

const SimliAgent: React.FC<SimliAgentProps> = ({ onStart, onClose }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  const [tempRoomUrl, setTempRoomUrl] = useState<string>("");
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const myCallObjRef = useRef<DailyCall | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  /**
   * Create a new Simli room and join it using Daily
   */
  const handleJoinRoom = async () => {
    // Set loading state
    setIsLoading(true);

    const response = await fetch("https://api.simli.ai/session/c5b2f5fb-7efc-43a3-a117-d22174cf1697/gAAAAABoND4CXA7qJUu44LStgnzjcVUt15jnWRYCLVRL2QHDYq7gK5ebCP-IyD90YIP5XWGG9nfUFATh9COCBUsVdZlg10trPGX_D2wWs7laZA3Js6Tni27otVXEOOIZxteLVA9tN_7UcixKCcvPqoFwVatxYz7hnVdGvJ8xYr_EpRJKhDidCp-BU4uhUtQKVLhz9qM7C3QgoZSPx1ngtsUK-YBAGKUhhnL514uONZHNHUjF11KFGLNTgdYN4QK5z4T4TQiVb1mnmQAdu5N2GmyiGTSvlaad_izXaXdXkMwTDr35hlxk9mujU5Z-3FczKF7mYQ3-uPs6txdAWKJFLubJUmkDNd6Faj7rct2Lbt7qFrdTx_P8tPQhZ8T0uZzWtpycTTrsSf8kdMcWxbPGbbdlCJaBbhm6mQ==", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
      },
  })
  
  const data = await response.json();
  const roomUrl = data.roomUrl;

    // Print the API response 
    console.log("API Response", data);

    // Create a new Daily call object
    let newCallObject = DailyIframe.getCallInstance();
    if (newCallObject === undefined) {
      newCallObject = DailyIframe.createCallObject({
        videoSource: false,
      });
    }

    // Setting my default username
    newCallObject.setUserName("User");

    // Join the Daily room
    await newCallObject.join({ url: roomUrl });
    myCallObjRef.current = newCallObject;
    console.log("Joined the room with callObject", newCallObject);
    setCallObject(newCallObject);

    // Start checking if Simli's Chatbot Avatar is available
    loadChatbot();
  };  

  /**
   * Checking if Simli's Chatbot avatar is available then render it
   */
  const loadChatbot = async () => {
    if (myCallObjRef.current) {
      let chatbotFound: boolean = false;

      const participants = myCallObjRef.current.participants();
      for (const [key, participant] of Object.entries(participants)) {
        if (participant.user_name === "Chatbot") {
          setChatbotId(participant.session_id);
          chatbotFound = true;
          setIsLoading(false);
          setIsAvatarVisible(true);
          onStart();
          break; // Stop iteration if you found the Chatbot
        }
      }
      if (!chatbotFound) {
        setTimeout(loadChatbot, 500);
      }
    } else {
      setTimeout(loadChatbot, 500);
    }
  };  

  /**
   * Leave the room
   */
  const handleLeaveRoom = async () => {
    if (callObject) {
      await callObject.leave();
      setCallObject(null);
      onClose();
      setIsAvatarVisible(false);
      setIsLoading(false);
    } else {
      console.log("CallObject is null");
    }
  };

  /**
   * Mute participant audio
   */
  const handleMute = async () => {
    if (callObject) {
      callObject.setLocalAudio(false);
    } else {
      console.log("CallObject is null");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFB3E6] to-[#EC4399]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <img src="https://eltallerdehector.com/wp-content/uploads/2023/07/Descargar-Logo-Barbie-Glitter.png" alt="Barbie Logo" className="w-64 h-auto" />
          {isAvatarVisible && (
            <div className="relative h-[350px] w-[350px] mx-auto bg-[#EC4399] rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-full w-full">
                <DailyProvider callObject={callObject}>
                  {chatbotId && <VideoBox key={chatbotId} id={chatbotId} />}
                </DailyProvider>
              </div>
            </div>
          )}
          {!isAvatarVisible ? (
            <>
              <button
                onClick={handleJoinRoom}
                disabled={isLoading}
                className={cn(
                  "w-full h-[52px] mt-4 disabled:bg-[#EC4399] disabled:text-white disabled:hover:rounded-[100px] bg-[#FFB3E6] text-[#EC4399] py-3 px-6 rounded-[100px] transition-all duration-300 hover:text-white hover:bg-[#EC4399] hover:rounded-sm shadow-lg font-bold",
                  "flex justify-center items-center"
                )}
              >
                {isLoading ? (
                  <IconSparkleLoader className="h-[20px] animate-loader" />
                ) : (
                  <span className="font-abc-repro-mono font-bold w-[164px]">
                    Let's chat with Barbie
                  </span>
                )}
              </button>
              <p className="mt-4 text-[#EC4399] font-cursive text-center text-lg">
                Welcome to Barbie's chat! Have fun and be kind!
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={handleLeaveRoom}
                  className={cn(
                    "mt-4 group text-[#FFB3E6] flex-grow bg-[#EC4399] hover:rounded-sm hover:bg-[#FFB3E6] h-[52px] px-6 rounded-[100px] transition-all duration-300 shadow-lg font-bold"
                  )}
                >
                  <span className="font-abc-repro-mono group-hover:text-black font-bold w-[164px] transition-all duration-300">
                    GoodBye Barbie
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimliAgent;
