import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { xml2json } from './util';
import './App.css';

const collection_url = "https://boardgamegeek.com/xmlapi2/collection?excludesubtype=boardgameexpansion&stats=1&own=1&username=";

function App() {
  const [collection, setCollection] = useState(null);
  const [user, getUser] = useState("");

  async function getCollection(username) {
    const getCollectionData = await fetch(collection_url + username)
      .then(response => response.text())
      .then(xmlString => new DOMParser().parseFromString(xmlString, 'text/xml'))
      .then(xml => xml2json(xml, ""))
      .then(json => JSON.parse(json))
      .then(collectionData => setCollection(collectionData.items.item))
      .finally(console.log("done"));
  }

  useEffect(() => {
    getCollection("fowlinbasket");
  }, []);

  useEffect(() => {
    console.log(collection);
  }, [collection]);

  return (
    <>
    </>
  )
}

export default App
