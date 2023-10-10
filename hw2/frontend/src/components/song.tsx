import  {useState, useEffect, useRef} from 'react';

import { Paper } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import {updateCard } from "@/utils/client";

type OnCheckboxChangeCallback = (isChecked: boolean, songId: string) => void;

export type SongProps = {
    id: string;
    title: string;
    description: string;
    link: string;
    listId: string;
    editting: boolean;
    selectingAll: boolean;
    onCheckboxChange: OnCheckboxChangeCallback;
}

export default function Song({id, title, description, link, listId, editting, selectingAll, onCheckboxChange}:SongProps) {
  const [checked, setChecked] = useState(false);
  const [edittingTitle, setEdittingTitle] = useState(false);
  const [edittingDescription, setEdittingDescription] = useState(false);
  const [edittingLink, setEdittingLink] = useState(false);

  const inputRefTitle = useRef<HTMLInputElement>(null);
  const inputRefDescription = useRef<HTMLInputElement>(null);
  const inputRefLink = useRef<HTMLInputElement>(null);

  const { lists, fetchCards } = useCards();

  useEffect(() => {
    if(selectingAll){
      setChecked(true);
    }
    else{
      setChecked(false);
    }
  }, [selectingAll])

 
  const handleCheckboxClick = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);

    // Call the callback function with the song ID and the new checked state
    onCheckboxChange(newCheckedState, id);
  };

  const handleUpdateTitle = async () => {
    if (!inputRefTitle.current)
      return;

    const newTitle = inputRefTitle.current.value;
    if (newTitle !== title) {
      try {
        await updateCard(id, {
          title: newTitle,
          description: description,
          link: link,
          list_id: listId,
        });
      } catch (error) {
        alert("Error: Failed to update song name");
      }
    }

    fetchCards();

    setEdittingTitle(false);
  };

  const handleUpdateDescription = async () => {
    if (!inputRefDescription.current) return;

    const newDescription = inputRefDescription.current.value;
    if (newDescription !== description) {
      try {
        await updateCard(id, {
          title: title,
          description: newDescription,
          link: link,
          list_id: listId,
        });
      } catch (error) {
        alert("Error: Failed to update singer");
      }
    }

    fetchCards();

    setEdittingDescription(false);
  };
  
  const handleUpdateLink = async () => {
    if (!inputRefLink.current) return;

    const newLink = inputRefLink.current.value;
    if (newLink !== link) {
      try {
        await updateCard(id, {
          title: title,
          description: description,
          link: newLink,
          list_id: listId,
        });
      } catch (error) {
        alert("Error: Failed to update link");
      }
    }
    
    fetchCards();

    setEdittingLink(false);
  }
  
    return(
      <>
    <Paper className="flex flex-col" elevation={6}>
      
      <div className='grid grid-cols-4'>
      <Checkbox
      checked={checked}
      onClick={handleCheckboxClick}
      />

      {(edittingTitle && editting) ? (
          <ClickAwayListener onClickAway={handleUpdateTitle}>
            <Input
              autoFocus
              defaultValue={title}
              className="grow"
              placeholder="Enter a new name for this song..."
              sx={{ fontSize: "1.25rem" }}
              inputRef={inputRefTitle}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => {
              if(editting)
              {setEdittingTitle(true);}
            }}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start" variant="h6">
              {title}
            </Typography>
          </button>
        )}


        
      {(edittingDescription && editting) ? (
          <ClickAwayListener onClickAway={handleUpdateDescription}>
            <Input
              autoFocus
              defaultValue={description}
              className="grow"
              placeholder="Enter a singer for this song..."
              sx={{ fontSize: "1.25rem" }}
              inputRef={inputRefDescription}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => {
              if(editting)
              {setEdittingDescription(true);}
            }}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start" variant="h6">
              {description}
            </Typography>
          </button>
        )}

      {(edittingLink && editting) ? (
          <ClickAwayListener onClickAway={handleUpdateLink}>
            <Input
              autoFocus
              defaultValue={link}
              className="grow"
              placeholder="Enter the link of this song..."
              sx={{ fontSize: "1.25rem" }}
              inputRef={inputRefLink}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => {
              if(editting)
              {setEdittingLink(true);}
              else{
                window.open(link, '_blank');
              }
            }}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start" variant="h6">
              {link}
            </Typography>
          </button>
        )}


        

        {/* <div className='hover:cursor-pointer'>
          <Typography variant="h6" component="div" ml={2} onClick={() => window.open(link, '_blank')}>
            {link}
          </Typography>
        </div> */}
      
      
      </div>

    </Paper>
    </>
    )
}
