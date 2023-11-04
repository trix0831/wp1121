import { eq, desc, isNull, sql } from "drizzle-orm";
import NameDialog from "@/components/NameDialog";
import TweetInput from "@/components/TweetInput";
import NameInput from "@/components/NameInput";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { likesTable, tweetsTable, usersTable } from "@/db/schema";

import SearchedTweet from "@/components/SearchedTweet";

type HomePageProps = {
  searchParams: {
    username?: string;
    handle?: string;
  };
};

export default async function Home({
  searchParams: { username, handle },
}: HomePageProps) {
  if (username && handle) {
    await db
      .insert(usersTable)
      .values({
        displayName: username,
        handle,
      })
      .onConflictDoUpdate({
        target: usersTable.handle,
        set: {
          displayName: username,
        },
      })
      .execute();
  }

  const likesSubquery = db.$with("likes_count").as(
    db
      .select({
        tweetId: likesTable.tweetId,
        likes: sql<number | null>`count(*)`.mapWith(Number).as("likes"),
      })
      .from(likesTable)
      .groupBy(likesTable.tweetId),
  );

  const likedSubquery = db.$with("liked").as(
    db
      .select({
        tweetId: likesTable.tweetId,
        liked: sql<number>`1`.mapWith(Boolean).as("liked"),
      })
      .from(likesTable)
      .where(eq(likesTable.userHandle, handle ?? "")),
  );

  const tweetALL = await db
    .select({
      id: tweetsTable.id,
    })
    .from(tweetsTable)
    .execute();

  // Fetch all tweets without filtering
  const allTweets = await db
    .with(likesSubquery, likedSubquery)
    .select({
      id: tweetsTable.id,
      content: tweetsTable.content,
      startDate: tweetsTable.startDate,
      endDate: tweetsTable.endDate,
      username: usersTable.displayName,
      handle: usersTable.handle,
      likes: likesSubquery.likes,
      createdAt: tweetsTable.createdAt,
      liked: likedSubquery.liked,
    })
    .from(tweetsTable)
    .where(isNull(tweetsTable.replyToTweetId))
    .orderBy(desc(tweetsTable.createdAt))
    .innerJoin(usersTable, eq(tweetsTable.userHandle, usersTable.handle))
    .leftJoin(likesSubquery, eq(tweetsTable.id, likesSubquery.tweetId))
    .leftJoin(likedSubquery, eq(tweetsTable.id, likedSubquery.tweetId))
    .execute();

    type allTweetsType = {id: number; username: string; handle: string; content: string; endDate: string; startDate: string; likes: number; liked: boolean; createdAt: Date;}

    const allTweetsList: allTweetsType[] = allTweets.map((tweet) => ({
      id: tweet.id,
      username: tweet.username,
      handle: tweet.handle,
      content: tweet.content,
      endDate: tweet.endDate,
      startDate: tweet.startDate,
      likes: tweet.likes,
      liked: tweet.liked,
      createdAt: tweet.createdAt!,
    }));

  // Filter tweets based on search criteria (username or handle)

  const user = await db
    .select({
      displayName: usersTable.displayName,
      handle: usersTable.handle,
    })
    .from(usersTable)
    .execute();

  const usersWithDisplayName = await db
    .select({
      displayName: usersTable.displayName,
    })
    .from(usersTable)
    .execute();

  const userDisplay = usersWithDisplayName.map((user) => user.displayName);

  return (
    <>
      <div className="flex h-screen w-full flex-col pt-2">
        <h1 className="mb-2 bg-white px-4 text-xl font-bold">Home</h1>
        <NameInput userNum={user.length} userDisplayName={userDisplay} />

        <div className="w-full px-4 pt-3">
          <TweetInput 
            tweetNum={tweetALL.length}
          />
        </div>

        <Separator />

        <SearchedTweet
          allTweets={allTweetsList}
          username={username}
          handle={handle}
        />

      </div>
      <NameDialog userNum={user.length} userDisplayName={userDisplay} />
    </>
  );
}
