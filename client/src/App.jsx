import { useEffect, useState, ReactDOM } from 'react';
import { xml2json, shuffle } from './util';
import WheelComponent from 'react-wheel-of-prizes';
import { SpinWheel } from './Wheel';
import './App.css';

const collection_url = "https://boardgamegeek.com/xmlapi2/collection?stats=1&own=1";

function App() {
  const [collection, setCollection] = useState(null);
  const [wheelProps, setWheelProps] = useState(null);
  const [username, setUsername] = useState("");
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  // const [minComplexity, setMinComplexity] = useState(0);
  // const [maxComplexity, setMaxComplexity] = useState(5);
  const [minPlaytime, setMinPlaytime] = useState(0);
  const [maxPlaytime, setMaxPlaytime] = useState(0);
  const [includeExpansions, setIncludeExpansions] = useState(false);
  const [wheel, setWheel] = useState(null);
  const [useWeights, setUseWeights] = useState(false);

  async function getCollection(username) {
    let collectionData = [];

    const getCollectionData = await fetch(collection_url + "&username=" + username + "&excludesubtype=boardgameexpansion")
      .then(response => response.text())
      .then(xmlString => new DOMParser().parseFromString(xmlString, 'text/xml'))
      .then(xml => xml2json(xml, ""))
      .then(json => JSON.parse(json))
      .then(data => collectionData = [...collectionData, ...data.items.item])
      .catch(exception => alert("bgg user " + username + " was not found"))
      .finally(console.log("done"));

    const expansions = await fetch(collection_url + "&username=" + username + "&subtype=boardgameexpansion")
    .then(response => response.text())
    .then(xmlString => new DOMParser().parseFromString(xmlString, 'text/xml'))
    .then(xml => xml2json(xml, ""))
    .then(json => JSON.parse(json))
    .then(data => collectionData = [...collectionData, ...data.items.item])
    .catch(exception => alert("bgg user " + username + " was not found"))
    .finally(console.log("done"));

    setCollection(collectionData);
  }

  const wheelFilter = (item) => {
    const result = (
      (parseInt(item.stats["@maxplayers"]) >= parseInt(minPlayers))
      && (parseInt(maxPlayers) > 0 ? (parseInt(item.stats["@minplayers"]) <= parseInt(maxPlayers)) : true)
      && (parseInt(item.stats["@playingtime"]) >= parseInt(minPlaytime))
      && (parseInt(maxPlaytime) > 0 ? (parseInt(item.stats["@playingtime"]) <= parseInt(maxPlaytime)) : true)
      && (includeExpansions ? true : item["@subtype"] != "boardgameexpansion")
    );
    return result;
  };

  const makeWheelProps = () => {
    if (collection) {
      let segments = [];
      let segColors = [];
      let filteredCollection = collection.filter(item => wheelFilter(item));
      for (let item of filteredCollection) {
        segments.push(item.name["#text"]);
        segColors.push("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}));
      }
      if (segments.length == 0) {
        alert("No board games found that meet these criteria")
      }
      else {
        setWheelProps({segments: shuffle(segments), segColors: segColors});
      }
    }
  };

  useEffect(() => {
    console.log(collection);
  }, [collection]);

  useEffect(() => {
    console.log(wheelProps);
  }, [wheelProps]);

  useEffect(() => {
    console.log(includeExpansions);
  }, [includeExpansions]);

  return (
    <>
      <div className='forms'>
      <form className='username-form'>
        <label>
          BoardGameGeek Username
          <br/>
          <input 
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
        </label>
        <br/>
        <button type='button' onClick={() => getCollection(username)}>
          Get Collection
        </button>
      </form>
      <br/>
      {collection &&
        <form className='filter-form'>
          <label>
            Minimum Players
            <br/>
            <input 
              type='number'
              min={0}
              onEmptied={(e) => setMinPlayers(0)}
              value={minPlayers}
              onChange={(e) => setMinPlayers(e.target.value)}
              />
          </label>
          <br/>
          <label>
            Maximum Players
            <br/>
            <input 
              type='number'
              min={0}
              onEmptied={(e) => setMaxPlayers(0)}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              />
          </label>
          <br/>
          <label>
            Minimum Playtime (Minutes)
            <br/>
            <input 
              type='number'
              min={0}
              onEmptied={(e) => setMinPlaytime(0)}
              value={minPlaytime}
              onChange={(e) => setMinPlaytime(e.target.value)}
              />
          </label>
          <br/>
          <label>
            Maximum Playtime (Minutes)
            <br/>
            <input 
              type='number'
              min={0}
              onEmptied={(e) => setMaxPlaytime(0)}
              value={maxPlaytime}
              onChange={(e) => setMaxPlaytime(e.target.value)}
              />
          </label>
        <br/>
          <label>
            Include Expansions
            <input type='checkbox' name="excludesubtype" value="boardgameexpansion" onChange={e => setIncludeExpansions(e.target.checked)}/>
          </label>
          <br/>
          {wheelProps ? 
            <button type='button' onClick={() => setWheelProps(null)}>Reset Wheel</button>
            :
            <button type='button' onClick={() => {makeWheelProps();}}>Apply Filters</button>
          }
        </form>
      }
      </div>
      <div className='wheel'>
        {wheelProps &&
          <WheelComponent
            segments={wheelProps.segments}
            segColors={wheelProps.segColors}
            onFinished={winner => console.log(winner)}
            primaryColor='black'
            contrastColor='white'
            buttonText='Spin'
            isOnlyOnce={false}
            size={290}
            upDuration={0}
            downDuration={300}
          />
        }
      </div>
    </>
  )
}

export default App
