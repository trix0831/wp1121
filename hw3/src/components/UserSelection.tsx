import Link from "next/link";


type UserSelctionProps = {
  username?: string;
  handle?: string;
  id: number;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function UserSelction({
  username,
  handle,
  id,
}: UserSelctionProps) {
  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/${id}`,
          query: {
            username,
            handle,
          },
        }}
      >
        {username}
        </Link>
    </>
  );
}
