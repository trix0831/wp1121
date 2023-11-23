"use client"
// TODO: 4. Call the signOut() function when the button is clicked
// hint: You may want to change the first line of this file
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut(); // Call the signOut function
  };

  return (
    <Button variant={"outline"} onClick={handleSignOut} data-testid="sign-out-button">
      Sign Out
    </Button>
  );
}
// import { signOut } from "next-auth/react";

// import { Button } from "@/components/ui/button";

// export default function SignOutButton() {
//   return <Button variant={"outline"} >Sign Out</Button>;
// }
// TODO: 4. end
