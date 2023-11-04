import { db } from "@/db";
import { usersTable } from "@/db/schema";


export default async function TestPage() {

    const user = await db
    .select({
      displayName: usersTable.displayName,
      handle: usersTable.handle,
    })
    .from(usersTable)
    .execute();

    return(
        <>
            <p>{user.length}</p>

            <div>
                {user.map((person) => (
                    <li key="1">{person.displayName} {person.handle}</li>
                ))}
            </div>
            
        </>
    );
  }