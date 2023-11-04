import Link from "next/link";

import { db } from "@/db";
import { usersTable } from "@/db/schema";


export default async function TestPage() {

    const user = await db
    .select({
      displayName: usersTable.displayName,
      handle: usersTable.handle,
      id: usersTable.id,
    })
    .from(usersTable)
    .execute();

    return(
        <>
            <p className="">Click on the user you want to switch to.</p>
            
            <div>
                {user.map((person) => (
                    <li className="m-5" key="1">
                        <Link
                            className="w-full px-4 pt-3 transition-colors hover:bg-gray-75"
                            href={{
                                pathname: "/",
                                query: {
                                username: person.displayName, // Pass the username from the user object
                                handle: person.handle, // Pass the handle from the user object
                                },
                            }}
                            >
                                {person.displayName}
                        </Link>
                    </li>
                ))}
            </div>

            
        </>
    );
  }