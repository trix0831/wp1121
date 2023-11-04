"use client";

import Tweet from "./Tweet";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";

type SearchedTweetProps = {
    allTweets: {
        id: number;
        username: string;
        handle: string;
        content: string;
        endDate: string;
        startDate: string;
        likes: number;
        liked: boolean;
        createdAt: Date;
      }[];
    username?: string;
    handle?: string;
  };

export default function SearchedTweet({allTweets, username, handle} : SearchedTweetProps){
    const [searchInput, setSearchInput] = useState("");
    const [filteredTweets, setFilteredTweets] = useState(allTweets); // Initialize with all tweets

    const handleSearch = () => {
        const filteredTweets = allTweets.filter((tweet) => {
        // Implement your search criteria here
        return tweet.content.includes(searchInput);
        });

        setFilteredTweets(filteredTweets);
    };

    useEffect(()=>{
      setFilteredTweets(allTweets);
    },[allTweets]
    )
    
    
    return(
        <>
      <div className="flex h-screen w-full flex-col pt-2">

        <div className="w-full px-4 pt-3">
          <input
            type="text"
            placeholder=" Search Tweets"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border-2 border-gray-600"
          />
          <Button onClick={handleSearch} className="ml-5">Search</Button>
        </div>

        <Separator className="mt-4"/>

        <div className="overflow-scroll">
            {filteredTweets.map((tweet) => (
            <Tweet
                key={tweet.id}
                id={tweet.id}
                username={username}
                handle={handle}
                authorName={tweet.username}
                authorHandle={tweet.handle}
                content={tweet.content}
                startDate={tweet.startDate}
                endDate={tweet.endDate}
                likes={tweet.likes}
                liked={tweet.liked}
                createdAt={tweet.createdAt!}
            />
            ))}
        </div>
      </div>
    </>
    );
}