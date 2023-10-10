import { useEffect, useState } from "react";
// import { Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

import CardList from "@/components/CardList";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import useCards from "@/hooks/useCards";
import Typography from "@mui/material/Typography";
// import { Visibility } from "@mui/icons-material";


function App() {
  const { lists, fetchLists, fetchCards } = useCards();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [deleteVisibility, setDeleteVisibility] = useState(false); 
  const [deleteButtonText, setDeleteButtonText] = useState("DELETE"); // Initial button text

  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchCards, fetchLists]);


  return (
    <>
      <HeaderBar />
      <main className="flex mb-4 mt-4 grid grid-row-2">
        
        <div className="grid grid-cols-3">
            <Typography variant="h5" component="div" ml={3}>
              My Playlists
            </Typography>

            &nbsp;&nbsp;
            
            <div>
            <Button
              variant="contained"
              className="w-12 mr-2"
              onClick={() => setNewListDialogOpen(true)}
            >
              ADD
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              className="w-12"
              onClick={() => {
                if(deleteVisibility){
                  setDeleteVisibility(false);
                  setDeleteButtonText("DELETE");
                }
                else{
                  setDeleteVisibility(true);
                  setDeleteButtonText("DONE");
                }
              }}
            >
              {deleteButtonText}
            </Button>
            </div>
          </div>
          
          <div className="m-5 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10">
            {lists.map((list => (
              <CardList key={list.id} {...list} visibility = {deleteVisibility} />
            )))}
          </div> 


          <NewListDialog
            open={newListDialogOpen}
            onClose={() => setNewListDialogOpen(false)}
          />
      </main>
    </>
  );
}

export default App;
