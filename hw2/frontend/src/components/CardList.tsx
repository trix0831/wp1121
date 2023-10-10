import { useRef, useState } from "react";

// import AddIcon from "@mui/icons-material/Add";
// import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import { deleteList, updateList } from "@/utils/client";

// import Card from "./Card";
import type { CardProps } from "./Card";
import CardDialog from "./CardDialog";
import PlaylistDialog from "@/components/PlaylistDialog";

//delete button
import ChipDelete from '@mui/joy/ChipDelete';
import DeleteForever from '@mui/icons-material/DeleteForever';
// import { list } from "postcss";


export type CardListProps = {
  id: string;
  name: string;
  description: string;
  cards: CardProps[];
  visibility: boolean;
};


export default function CardList({ id, name, description, cards, visibility }: CardListProps) {
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  const [edittingName, setEdittingName] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const { fetchLists } = useCards();
  const inputRef = useRef<HTMLInputElement>(null);


  const handleUpdateName = async () => {
    if (!inputRef.current) return;

    const newName = inputRef.current.value;
    if (newName !== name) {
      try {
        await updateList(id, { name: newName });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    }
    setEdittingName(false);
  };

  const handleDelete = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  return (
    <>
      <Paper className="w-65 p-3" sx={{ position: 'relative' }}>
        {visibility && (<ChipDelete
          color="danger"
          variant="outlined"
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            marginTop: '-12px', /* Half of the icon's height */
            marginRight: '-12px', /* Half of the icon's width */
          }}
        >
          <DeleteForever />
        </ChipDelete>)}

        <div className="flex gap-4">
          {edittingName ? (
            <ClickAwayListener onClickAway={handleUpdateName}>
              <Input
                autoFocus
                defaultValue={name}
                className="grow"
                placeholder="Enter a new name for this list..."
                sx={{ fontSize: "2rem" }}
                inputRef={inputRef}
              />
            </ClickAwayListener>
          ) : (
            <button
              onClick={() => setEdittingName(true)}
              className="w-full rounded-md p-2 hover:bg-white/10"
            >
              <Typography className="text-start" variant="h4">
                {name}
              </Typography>
            </button>
          )}

        </div>

        <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />

        <div>
          <img onClick={() => setShowPlaylist(true)} src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWljcm9waG9uZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"></img>
        </div>

        <PlaylistDialog 
            open={showPlaylist}
            songs={cards}
            onClose={() => setShowPlaylist(false)}
            listId={id}
            title={name}
            description={description}
          />

        <div>
            {cards.length} songs
        </div>
        
        {/* <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}

          {true && <Button
            variant="contained"
            onClick={() => setOpenNewCardDialog(true)}
          >
            <AddIcon className="mr-2" />
            Add a song
          </Button>}
        </div> */}

      </Paper>

      
      <CardDialog
        variant="new"
        open={openNewCardDialog}
        onClose={() => setOpenNewCardDialog(false)}
        listId={id}
      />
    </>
  );
}
