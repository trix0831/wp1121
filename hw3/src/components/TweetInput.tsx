"use client";

import { useRef, useState, useEffect } from "react";
import GrowingTextarea from "@/components/GrowingTextarea";
import { Separator } from "@/components/ui/separator";
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

export default function TweetInput() {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const { postTweet, loading } = useTweet();
  const [showModal, setShowModal] = useState(false);

  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:00`;
  };

  const handleTweet = async () => {
    const content = textareaRef.current?.value;

    if (!content) {
      alert('Please enter the event name !');
      return;
    }
    if (!handle) return;
    if (!startDateTime || !endDateTime) {
      alert('Please enter the start/end time !');
      return;
    }

    const startTimestamp = new Date(startDateTime).getTime();
    const endTimestamp = new Date(endDateTime).getTime();
    const timeDifferenceHours = (endTimestamp - startTimestamp) / (1000 * 60 * 60);

    if (startTimestamp >= endTimestamp) {
      alert("Start time must be earlier than the end time.");
      return;
    }

    if (timeDifferenceHours > 168) {
      alert("The interval between start and end time cannot exceed 168 hours (7 days).");
      return;
    }

    try {
      console.log(startDateTime);
      console.log(endDateTime);

      await postTweet({
        handle,
        content,
        startDate: formatDateTime(startDateTime),
        endDate: formatDateTime(endDateTime),
      });

      textareaRef.current.value = "";
      textareaRef.current.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

      // Reset the date and time input values after posting
      setStartDateTime("");
      setEndDateTime("");
    } catch (e) {
      console.error(e);
      alert("Error posting tweet");
    }
  }

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleStartDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDateTime(event.target.value);
  }

  const handleEndDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateTime(event.target.value);
  }

  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (showModal && e.target instanceof HTMLElement) {
        if (!document.getElementById("modal")?.contains(e.target)) {
          closeModal();
        }
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [showModal]);

  return (
    <>
      <button
        className={cn(
          "m-1 mb-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
          "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover-bg-brand/40",
        )}
        onClick={openModal}
      >
        {"add event"}
      </button>

      {showModal && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div id="modal" className="bg-white w-3/4 p-6 rounded-lg shadow-lg">
            <p>Create an event !</p>
            <div className="flex w-full flex-col px-2">
              <div className="mb-2 mt-6">
                <GrowingTextarea
                  ref={textareaRef}
                  className="bg-transparent outline-none placeholder:text-gray-500 max-w-2xl whitespace-normal overflow-auto"
                  placeholder="Enter the event name"
                />
              </div>
              <Separator />
              <p>Start time (press the small icon on the right to edit) ("minute" is disabled):</p>
              <input
                type="datetime-local"
                className="bg-transparent outline-none placeholder:text-gray-500 mb-2"
                value={formatDateTime(startDateTime)}
                onChange={handleStartDateTimeChange}
                step="3600"
              />
              <Separator />
              <p>End time:</p>
              <input
                type="datetime-local"
                className="bg-transparent outline-none placeholder:text-gray-500"
                value={formatDateTime(endDateTime)}
                onChange={handleEndDateTimeChange}
                step="3600"
              />
              <Separator />
              <div className="flex justify-end">
                <button
                  className={cn(
                    "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
                    "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover-bg-brand/40",
                  )}
                  onClick={handleTweet}
                  disabled={loading}
                >
                  CONFIRM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
