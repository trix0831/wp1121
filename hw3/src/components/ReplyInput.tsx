"use client";

import { useRef, useState } from "react";

import GrowingTextarea from "@/components/GrowingTextarea";
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import LikeButton from "./LikeButton";

type ReplyInputProps = {
  replyToTweetId: number;
  replyName?: string;
  startDate: string;
  endDate: string;
  tweetLikes: number;
  tweetLiked: boolean;
  tweetID: number;
  handleForButton?: string;
};

export default function ReplyInput({
  replyToTweetId,
  replyName,
  startDate,
  endDate,
  tweetLikes,
  tweetLiked, 
  tweetID,
  handleForButton
}: ReplyInputProps) {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postTweet, loading } = useTweet();
  const [participateStateControl, setParticipateStateControl] = useState(false);

  const handleReply = async () => {
    const content = textareaRef.current?.value;
    if (!content) return;
    if (!handle) return;

    try {
      await postTweet({
        handle,
        content,
        startDate,
        endDate,
        replyToTweetId,
      });
      textareaRef.current.value = "";
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting reply");
    }
  };

  return (
    // this allows us to focus (put the cursor in) the textarea when the user
    // clicks anywhere on the div
    <>
      <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
        <LikeButton
          handle={handleForButton}
          initialLikes={tweetLikes}
          initialLiked={tweetLiked}
          tweetId={tweetID}
          onParticipateState={(participateState:boolean) => setParticipateStateControl(participateState)}
        />
      </div>
      <Separator />
        <div onClick={() => textareaRef.current?.focus()}>
          <div className="grid grid-cols-[fit-content(48px)_1fr] gap-4 px-4 pt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <p className="col-start-2 row-start-1 text-gray-950 text-lg">
              You are now replying as <b>{replyName}</b>
            </p>

            <GrowingTextarea
              ref={textareaRef}
              wrapperClassName="col-start-2 row-start-2"
              className="bg-transparent text-base outline-none placeholder:text-gray-450 ml-3"
              placeholder="text your message here"
            />
          </div>
          <div className="p-4 text-end">
            <button
              className={cn(
                "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
                "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
              )}
              onClick={handleReply}
              disabled={loading || (!participateStateControl)}
            >
              Reply
            </button>
          </div>
        </div>
    </>
  );
}
