import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import TimeText from "./TimeText";

import { Check } from 'lucide-react';

type TweetProps = {
  username?: string;
  handle?: string;
  id: number;
  authorName: string;
  authorHandle: string;
  content: string;
  startDate: string;
  endDate: string;
  likes: number;
  createdAt: Date;
  liked?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Tweet({
  username,
  handle,
  id,
  content,
  startDate,
  endDate,
  likes,
  createdAt,
  liked,
}: TweetProps) {
  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/tweet/${id}`,
          query: {
            username,
            handle,
          },
        }}
      >
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <article>
            <p className="font-bold ml-5 max-w-2xl whitespace-normal overflow-auto">
            {content}
            </p>
            <time className="ml-6 font-normal text-gray-400">
                create time：
                <TimeText date={createdAt} format="h:mm A · D MMM YYYY" />
            </time>
            <div className="ml-10">
              START time：
              <TimeText date={startDate} format="h:mm A · D MMM YYYY" />
            </div>
            <div className="ml-10">
              END time：
              <TimeText date={endDate} format="h:mm A · D MMM YYYY" />
            </div>
          </article>
          
          <article className="flex grow flex-col text-gray-700">
            {likes ? likes : 0} participants
          </article>

          {liked && <Check className="" color="#2bff00" size={64} strokeWidth={3}/>}

        </div>
      </Link>
      <Separator />
    </>
  );
}
