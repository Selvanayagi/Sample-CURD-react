import './App.css';
import { useState, useEffect } from "react";
import { Multiselect } from "multiselect-react-dropdown";
// import 'bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const [list, updateList] = useState([]); // stores all songs in database
  const [options,setoptions] = useState([]); //stores all selected dropdown values for creating playlist
  const [playname, setpname] = useState(""); //stores name of the new playlist
  const[playlist,setplaylist] = useState([]); //stores all playlist details from database
  const [searchText, setSearchVal] = useState('');//search box 

  //use effect that fetches details of songs and playlist from database using api
  useEffect(()=>{
    //songs
    var apiUrl = 'http://localhost:3001/songs';
    fetch(apiUrl).then(response => {
      return response.json();
    }).then(data1 => {
      updateList(data1)
      console.log(data1);
    }).catch(err => {
    });

    //playlits
    var apiUrlPlay = 'http://localhost:3001/playlist';
    fetch(apiUrlPlay).then(response => {
      return response.json();
    }).then(data1 => {
      setplaylist(data1)
      console.log(data1);
    }).catch(err => {
    });
  },[]);

  // delete a playlist
  const removeplayList = (e) => {
    const id = e.target.getAttribute("name");
    setplaylist(playlist.filter(item => item.name !== id));
  }
//add new play list
  const handleSubmit = (event) => {
    if(playname != "" && options.length!=0){
      var a ={
        "id":playlist.length+1,
        "name":playname,
        "songs":options
      }
      
      setplaylist(playlist => [...playlist, a]);
      setoptions([]);
      setpname("");
    }
    else{
      alert("please enter valid details!!")
    }
  }

  //add newly added songs to options 
  function onSelect(selectedList, selectedItem) {
    setoptions(options => [...options, selectedItem]);
  }

  //remove deleted songs from playlist
  function onRemove(selectedList, removedItem){
    setoptions(options.filter(item => item !==removedItem))
    console.log(options)
  }

  function openbox(){
    document.getElementById("open-box").style.display="block";
  }

  function closebox(){
    document.getElementById("open-box").style.display="none";
  }
  return (
    <div className="App">
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4"><h1>SAMPLE CRUD APP</h1></div>
        <div className="col-4">
          <div className="inputContainer">
            <i className="fa fa-search icon"> </i>
            <input  className="Field" type="text" placeholder="Search here..."  onChange={(e)=> setSearchVal(e.target.value)} onClick={openbox} />
          </div>
          <div className="search-results" id="open-box" >
            {playlist.map((i)=>{
              return(
                  i.name.toLowerCase().includes(searchText.toLowerCase())?<div>{i.name}</div>:<></>
              )
            })}
          </div>
        </div>
      </div>

      {/* play list table */}
      <table>
        <tr>
          <th>Name</th>
          <th>Songs</th>
          <th>Remove</th>
        </tr>
        {playlist.map((i)=>{
          return(
            i.name.toLowerCase().includes(searchText.toLowerCase())?<tr>
            <td>{i.name}</td>
            <td>
              <ul>
                {i.songs.map(item => {
                  return (<li>{item}</li>);
                })}
              </ul>
            </td>
            <td><button name={i.name} onClick={removeplayList}>Remove</button></td>
          </tr>:<></>
          )
        })}
      </table>

      {/* form for creating playlist */}
      <h2>Create a new playList</h2>
      <div class="createForm">
        <div className="FormList row">
          <div className="col-4"><label>Playlist name: </label></div>
          <div className="col-4"><input autocomplete="off" value={playname} name="pname" type="text" onChange={(e)=> {setpname(e.target.value);}} /></div>
          <div className="col-4"></div>
        </div>
      
        <div className="FormList row">
          <div className="col-4"><label>Songs :</label></div>
          <div className="col-4"><Multiselect onSelect={onSelect} onRemove={onRemove} selectedValues={options}  showArrow options={list} isObject={false} /></div>
          <div className="col-4"></div>
        </div>

        <button onClick={handleSubmit} > Submit </button>
      </div>
    </div>
  );
}

export default App;
