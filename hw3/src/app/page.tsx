// import { eq, desc, isNull, sql } from "drizzle-orm";

// import NameDialog from "@/components/NameDialog";
// import Tweet from "@/components/Tweet";
// import TweetInput from "@/components/TweetInput";
// import NameInput from "@/components/NameInput";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { db } from "@/db";
// import { likesTable, tweetsTable, usersTable } from "@/db/schema";

// import { cn } from "@/lib/utils";

// type HomePageProps = {
//   searchParams: {
//     username?: string;
//     handle?: string;
//   };
// };

// // Since this is a server component, we can do some server side processing
// // in the react component. This may seem crazy at first, but it's actually
// // a very powerful feature. It allows us to do the data fetching and rendering
// // the page in the same place. It may seem weird to run react code on the server,
// // but remember, react is not just for the browser, react-dom is. React is just
// // the shadow dom and state update logic. We can use react to render anything,
// // any where. There are already libraries that use react to render to the terminal,
// // email, PDFs, native mobile apps, 3D objects and even videos.
// export default async function Home({
//   searchParams: { username, handle },
// }: HomePageProps) {
//   // read the username and handle from the query params and insert the user
//   // if needed.
//   if (username && handle) {
//       // The user does not exist, you can proceed with inserting the user
//       await db
//         .insert(usersTable)
//         .values({
//           displayName: username,
//           handle,
//         })
//         .onConflictDoUpdate({
//           target: usersTable.handle,
//           set: {
//             displayName: username,
//           },
//         })
//         .execute();
//   }   // Since handle is a unique column, we need to handle the case
//       // where the user already exists. We can do this with onConflictDoUpdate
//       // If the user already exists, we just update the display name
//       // This way we don't have to worry about checking if the user exists
//       // before inserting them.


//   // This is a good example of using subqueries, joins, and with statements
//   // to get the data we need in a single query. This is a more complicated
//   // query, go to src/app/tweet/[tweet_id]/page.tsx to see a simpler example.
//   //
//   // This is much more efficient than running separate queries for tweets,
//   // likes, and liked, and then combining them in javascript. Not only is
//   // the data processing done in the database, but we also only need to
//   // make a single request to the database instead of three.

//   // WITH clause is used to create a temporary table that can be used in the
//   // main query. This is useful for creating subqueries that are used multiple
//   // times in the main query. Or just to make the main query more readable.
//   // read more about it here: https://orm.drizzle.team/docs/select#with-clause
//   // If you're familiar with CTEs in SQL, watch this video:
//   // https://planetscale.com/learn/courses/mysql-for-developers/queries/common-table-expressions-ctes
//   //
//   // This subquery generates the following SQL:
//   // WITH likes_count AS (
//   //  SELECT
//   //   tweet_id,
//   //   count(*) AS likes
//   //   FROM likes
//   //   GROUP BY tweet_id
//   // )
//   const likesSubquery = db.$with("likes_count").as(
//     db
//       .select({
//         tweetId: likesTable.tweetId,
//         // some times we need to do some custom logic in sql
//         // although drizzle-orm is very powerful, it doesn't support every possible
//         // SQL query. In these cases, we can use the sql template literal tag
//         // to write raw SQL queries.
//         // read more about it here: https://orm.drizzle.team/docs/sql
//         likes: sql<number | null>`count(*)`.mapWith(Number).as("likes"),
//       })
//       .from(likesTable)
//       .groupBy(likesTable.tweetId),
//   );

//   // This subquery generates the following SQL:
//   // WITH liked AS (
//   //  SELECT
//   //   tweet_id,
//   //   1 AS liked
//   //   FROM likes
//   //   WHERE user_handle = {handle}
//   //  )
//   const likedSubquery = db.$with("liked").as(
//     db
//       .select({
//         tweetId: likesTable.tweetId,
//         // this is a way to make a boolean column (kind of) in SQL
//         // so when this column is joined with the tweets table, we will
//         // get a constant 1 if the user liked the tweet, and null otherwise
//         // we can then use the mapWith(Boolean) function to convert the
//         // constant 1 to true, and null to false
//         liked: sql<number>`1`.mapWith(Boolean).as("liked"),
//       })
//       .from(likesTable)
//       .where(eq(likesTable.userHandle, handle ?? "")),
//   );

//   const tweets = await db
//     .with(likesSubquery, likedSubquery)
//     .select({
//       id: tweetsTable.id,
//       content: tweetsTable.content,
//       startDate: tweetsTable.startDate,
//       endDate: tweetsTable.endDate,
//       username: usersTable.displayName,
//       handle: usersTable.handle,
//       likes: likesSubquery.likes,
//       createdAt: tweetsTable.createdAt,
//       liked: likedSubquery.liked,
//     })
//     .from(tweetsTable)
//     .where(isNull(tweetsTable.replyToTweetId))
//     .orderBy(desc(tweetsTable.createdAt))
//     // JOIN is by far the most powerful feature of relational databases
//     // it allows us to combine data from multiple tables into a single query
//     // read more about it here: https://orm.drizzle.team/docs/select#join
//     // or watch this video:
//     // https://planetscale.com/learn/courses/mysql-for-developers/queries/an-overview-of-joins
//     .innerJoin(usersTable, eq(tweetsTable.userHandle, usersTable.handle))
//     .leftJoin(likesSubquery, eq(tweetsTable.id, likesSubquery.tweetId))
//     .leftJoin(likedSubquery, eq(tweetsTable.id, likedSubquery.tweetId))
//     .execute();

//     const user = await db
//     .select({
//       displayName: usersTable.displayName,
//       handle: usersTable.handle,
//     })
//     .from(usersTable)
//     .execute();

//     const usersWithDisplayName = await db
//     .select({
//       displayName: usersTable.displayName,
//     })
//     .from(usersTable)
//     .execute();
  
//     const userDisplay = usersWithDisplayName.map(user => user.displayName);


//   return (
//     <>
//         <div className="flex h-screen w-full flex-col pt-2">
//           <h1 className="mb-2 bg-white px-4 text-xl font-bold">Home</h1>
//           <NameInput
//             userNum={user.length}
//             userDisplayName={userDisplay}
//           />

//           <div className="w-full px-4 pt-3">
//             <TweetInput />
//           </div>

//           <Separator />
          
//           <div className="overflow-scroll">
//             {tweets.map((tweet) => (
//               <Tweet
//                 key={tweet.id}
//                 id={tweet.id}
//                 username={username}
//                 handle={handle}
//                 authorName={tweet.username}
//                 authorHandle={tweet.handle}
//                 content={tweet.content}
//                 startDate={tweet.startDate}
//                 endDate={tweet.endDate}
//                 likes={tweet.likes}
//                 liked={tweet.liked}
//                 createdAt={tweet.createdAt!}
//               />
//             ))}
//           </div>
//         </div>
//         <NameDialog 
//           userNum={user.length}
//           userDisplayName={userDisplay}
//         />
//     </>
//   );
// }

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
          <TweetInput />
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