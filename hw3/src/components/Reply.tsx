import { Separator } from "@/components/ui/separator";

import TimeText from "./TimeText";

type ReplyProps = {
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
export default function Reply({
  username,
  content,
  createdAt,
}: ReplyProps) {
  return (
    <>
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <article className="flex grow flex-col">
            <p className="font-bold ml-5">
            {username}
              <time className="ml-2 font-normal text-gray-400">
                reply time：
                <TimeText date={createdAt} format="h:mm A · D MMM YYYY" />
              </time>
            </p>
            <article className="mt-2 ml-7 whitespace-pre-wrap">
              {content}
            </article>
            
          </article>
        </div>
      <Separator />
    </>
  );
}
