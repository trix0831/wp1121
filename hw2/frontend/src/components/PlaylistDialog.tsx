import React, { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import HeaderBar from "@/components/HeaderBar";
import { Button } from "@mui/material";
import Slide from '@mui/material/Slide';
import type {TransitionProps} from '@mui/material/transitions';
import Typography from "@mui/material/Typography";
import Song from "@/components/song";
import type { SongProps } from "@/components/song";
import Checkbox from '@mui/material/Checkbox';

import CardDialog from "./CardDialog";
import {deleteCard , updateList  } from "@/utils/client";
import useCards from "@/hooks/useCards";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Input from "@mui/material/Input";

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type PlaylistDialogProps = {
  open: boolean;
  songs: SongProps[];
  onClose: () => void;
  listId: string;
  title: string;
  description: string;
};

export default function PlaylistDialog({ open, songs, onClose, listId, title, description}: PlaylistDialogProps) {
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [selectedSongsTitle, setSelectedSongsTitle] = useState<string[]>([]);
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  const [edittingTitle, setEdittingTitle] = useState(false);
  const [edittingDescription, setEdittingDescription] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [preHandleDelete, setPreHandleDelete] = useState(false);

  const [editButtonText, setEditButtonText] = useState("EDIT SONG");

  const { fetchLists } = useCards();
  const {fetchCards } = useCards();

  const inputRefTitle = useRef<HTMLInputElement>(null);
  const inputRefDescription = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = (songId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedSongs((prevSelectedSongs) => [...prevSelectedSongs, songId]);
    } else {
      setSelectedSongs((prevSelectedSongs) =>
        prevSelectedSongs.filter((id) => id !== songId)
      );
    }
  };

  const handleUpdateName = async () => {
    if (!inputRefTitle.current) return;

    const newTitle = inputRefTitle.current.value;
    if(newTitle == ""){
      alert("Please enter a title for the list")
    }
    else if (newTitle !== title) {
      try {
        await updateList(listId, { name: newTitle });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    }
    setEdittingTitle(false);
  };

  const handleUpdateDescription = async () => {
    if (!inputRefDescription.current) return;

    const newDescription = inputRefDescription.current.value;
    if(newDescription == ""){
      alert("Please enter a description for the list")
    }
    else if (newDescription !== description) {
      try {
        await updateList(listId, { description: newDescription });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list Description");
      }
    }
    setEdittingDescription(false);
  };

  const handleDelete = async () => {
    if (selectedSongs.length === 0) {
      alert("No song is selected.");
      setSelectAll(false);
    }

    else try {
      setSelectAll(false);
      
      await selectedSongs.map((selected) => {
        deleteCard(selected);
        fetchCards();
      })
    }catch (error) {
      alert(error);
    }

    // console.log("Deleting songs:", selectedSongs);
    // After deleting, you may want to update the songs list or state
    // to remove the deleted songs.
    setSelectedSongs([]);
    fetchCards();
  };


  const handleSelectAll = () => {
    setSelectAll(!selectAll); // Step 2: Toggle selectAll state

    // Step 3: Set the checked state of all song checkboxes
    songs.map((song) => ({
      ...song,
      selectingAll: !selectAll,
    }));

    songs.map((song) => {
      handleCheckboxChange(song.id, !selectAll);
    }
    );

  }

  const getSelectedTitle = () => {
    setSelectedSongsTitle([]);

    songs.map((song) => {
        // Use the filter method to check if the song's id is in the selectedSongs array
        const isSelected = selectedSongs.includes(song.id);

        // If the song is selected, add its title to the selectedSongsTitle array
        if (isSelected) {
          setSelectedSongsTitle((prevSelectedSongsTitle) => [...prevSelectedSongsTitle, song.title]);
        }
    })
  }


  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <HeaderBar />
        <div className='grid lg:grid-cols-3 md:grid-cols-2'>
          <img className='p-6' src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWljcm9waG9uZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"></img>
          <div className='lg:col-span-2 '>
            <div className='grid grid-rows-2'>
              {edittingTitle ? (
                <ClickAwayListener onClickAway={handleUpdateName}>
                  <Input
                    autoFocus
                    defaultValue={title}
                    className="grow"
                    placeholder="Enter a new name for this list..."
                    sx={{ fontSize: "1.75rem" }}
                    inputRef={inputRefTitle}
                  />
                </ClickAwayListener>
              ) : (
                <button
                  onClick={() => setEdittingTitle(true)}
                  className="w-full rounded-md p-2 hover:bg-white/10"
                >
                  <Typography className="text-start" variant="h4">
                    {title}
                  </Typography>
                </button>
              )}


              {edittingDescription ? (
                <ClickAwayListener onClickAway={handleUpdateDescription}>
                  <Input
                    autoFocus
                    defaultValue={description}
                    className="grow"
                    placeholder="Enter a new description for this list..."
                    sx={{ fontSize: "1.5rem" }}
                    inputRef={inputRefDescription}
                  />
                </ClickAwayListener>
              ) : (
                <button
                  onClick={() => setEdittingDescription(true)}
                  className="w-full rounded-md p-2 hover:bg-white/10"
                >
                  <Typography className="text-start" variant="h5">
                    {description}
                  </Typography>
                </button>
              )}
            </div>
          </div>
        </div>

        {editMode && <Typography className="text-start" variant="h6" color="#76ff03" ml={3}>
                    Editting Mode<br/>remember to clickaway before press DONE if you want to save content
        </Typography>}

        <div className='flex justify-end p-6'>
          <Button
            variant="contained"
            className="w-20 mr-2"
            onClick={onClose}
          >
            BACK
          </Button>

          &nbsp;&nbsp;

          <Button
            variant="contained"
            className="flex mr-2"
            onClick={() => {
              if (editButtonText == "EDIT SONG"){
                alert('you are now in the editting mode\ncontent would NOT be saved if you click the "DONE" button directly before clicking elsewhere of the page.')
                setEditButtonText("DONE");
                setEditMode(true);
              }
              else{
                setEditButtonText("EDIT SONG");
                setEditMode(false);
              }}}
          >
            {editButtonText}
          </Button>

          &nbsp;&nbsp;

          <Button
            variant="contained"
            className="w-20 mr-2"
            onClick={() => setOpenNewCardDialog(true)}
          >
            ADD
          </Button>

          &nbsp;&nbsp;

          <Button
            variant="contained"
            className="w-20"
            onClick={() => {
              if (selectedSongs.length === 0) {
                alert("No song is selected.");
                setSelectAll(false);
              }
              else{
              getSelectedTitle();
              setPreHandleDelete(true);
            }
            }}
          >
            DELETE
          </Button>
        </div>

        <div className='grid grid-cols-4'>
          <Checkbox
            checked={selectAll}
            onClick={() => handleSelectAll()}
          />
          <Typography variant="h5" component="div" ml={2} col-span={2}>
            song
          </Typography>
          <Typography variant="h5" component="div" ml={2} col-span={2}>
            singer
          </Typography>
        {!editMode && <Typography variant="h5" component="div" ml={2} col-span={2}>
            link (click to open link)
          </Typography>}
        {editMode && <Typography variant="h5" component="div" ml={2} col-span={2}>
          link (click to edit)
        </Typography>}
        
        </div>

        {songs.map((song) => (
          <Song
            key={song.id}
            {...song}
            listId={listId}
            editting={editMode}
            selectingAll={selectAll}
            onCheckboxChange={(isChecked:boolean) => handleCheckboxChange(song.id, isChecked)}
          />
        ))}
      </Dialog>

      <CardDialog
        variant="new"
        open={openNewCardDialog}
        onClose={() => setOpenNewCardDialog(false)}
        listId={listId}
      />

      <Dialog
        open={preHandleDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <div>
            Deleting the following songs:
            
              {selectedSongsTitle.map((SongTitle) => (
                <li key={SongTitle}>{SongTitle}</li>
              ))}
            
          </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreHandleDelete(false)}>Disagree</Button>
          <Button onClick={() => {
            setPreHandleDelete(false);
            handleDelete();
          }} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
}