import { useEffect, useState, ReactDOM } from 'react';
import { xml2json } from './util';
import WheelComponent from 'react-wheel-of-prizes';
import { SpinWheel } from './Wheel';
import './App.css';

const collection_url = "https://boardgamegeek.com/xmlapi2/collection?excludesubtype=boardgameexpansion&stats=1&own=1&username=";

function App() {
  const [collection, setCollection] = useState(null);
  const [wheelProps, setWheelProps] = useState(null);
  const [username, setUsername] = useState("fowlinbasket");
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  // const [minComplexity, setMinComplexity] = useState(0);
  // const [maxComplexity, setMaxComplexity] = useState(5);
  const [minPlaytime, setMinPlaytime] = useState(0);
  const [maxPlaytime, setMaxPlaytime] = useState(0);
  const [wheel, setWheel] = useState(null);
  const [useWeights, setUseWeights] = useState(false);

  async function getCollection(username) {
    const getCollectionData = await fetch(collection_url + username)
      .then(response => response.text())
      .then(xmlString => new DOMParser().parseFromString(xmlString, 'text/xml'))
      .then(xml => xml2json(xml, ""))
      .then(json => JSON.parse(json))
      .then(collectionData => setCollection(collectionData.items.item))
      .catch(exception => alert("bgg user " + username + " was not found"))
      .finally(console.log("done"));
  }

  const wheelFilter = (item) => {
    const result = (
      (item.stats["@minplayers"] >= minPlayers)
      && (item.stats["@minplayers"] <= maxPlayers || maxPlayers == 0)
      && (item.stats["@playingtime"] >= minPlaytime)
      && (item.stats["@playingtime"] <= maxPlaytime || maxPlaytime == 0)
    );
    return result;
  }

  const makeWheelProps = () => {
    if (collection) {
      let segments = [];
      let segColors = [];
      let filteredCollection = collection.filter(item => wheelFilter(item));
      for (let item of filteredCollection) {
        segments.push(item.name["#text"]);
        segColors.push("#FFFFFF");
      }
      setWheelProps({segments, segColors});
    }
  }

  useEffect(() => {
    console.log(wheelProps);
    if (wheelProps) {
      setWheel(new SpinWheel(wheelProps));
    }
  }, [wheelProps])

  useEffect(() => {
  }, [wheel, wheelProps])

  return (
    <>
      <div className='forms'>
      <form className='username-form'>
        <label>
          BoardGameGeek Username
          
          <input 
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
        </label>
        
        <button type='button' onClick={() => getCollection(username)}>
          Get Collection
        </button>
      </form>
      
      {collection &&
        <form className='filter-form'>
          <label>
            Minimum Players
            
            <input 
              type='number'
              min={0}
              value={minPlayers}
              onChange={(e) => setMinPlayers(e.target.value)}
              />
          </label>
          
          <label>
            Maximum Players
            
            <input 
              type='number'
              min={0}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              />
          </label>
          
          <label>
            Minimum Playtime
            
            <input 
              type='number'
              min={0}
              value={minPlaytime}
              onChange={(e) => setMinPlaytime(e.target.value)}
              />
          </label>
          
          <label>
            Maximum Playtime
            
            <input 
              type='number'
              min={0}
              value={maxPlaytime}
              onChange={(e) => setMaxPlaytime(e.target.value)}
              />
          </label>
          
          <button type='button'onClick={() => makeWheelProps()}>
            Apply Filters
          </button>
        </form>
      }
      </div>
      <div className='wheel'>
        {wheel && 
          wheel.render()
        }
      </div>
    </>
  )
}

export default App
