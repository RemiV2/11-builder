// Team of the week: https://www.easports.com/fifa/ultimate-team/api/fut/item?jsonParamObject=%7B%22page%22:1,%22quality%22:%22totw_gold%22,%22position%22:%22GK%22%7D

import React, { Component } from 'react'
import './App.css'

// Prepare API calls
// https://www.easports.com/fifa/ultimate-team/api/fut/item?jsonParamObject=%7B%22name%22:%22m%22%7D
const proxy = 'https://cors-anywhere.herokuapp.com/'
const urlStart = 'https://www.easports.com/fifa/ultimate-team/api/fut/item?jsonParamObject=%7B%22name%22:%22'
const urlEnd = '%22%7D'
const request = new XMLHttpRequest();
request.overrideMimeType("application/json")
let requestResult
let requestResults = []

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Settings">
          <h2 className="Sub-title">Create your lineup!</h2>
          <SearchPlayer/>
        </div>
        <Pitch/>
      </div>
    )
  }
}

class SearchPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      results: []
    }
    // Force method binding to React component
    this.updateSearch = this.updateSearch.bind(this);
  }

  updateSearch(event) {
    this.setState({ value: event.target.value })
    // TODO: find better fix
    window.setTimeout(() => {
      this.setState({
        results: getPlayersData(this.state.value)
      })
    }, 10)
  }

  render() {
    return (
      <div>
        <input
          className="Search-player"
          type="search"
          value={this.state.value}
          onChange={this.updateSearch}
          placeholder="Search for a player..."
          autoFocus
        />
        <div className="Results">
          {this.state.results.map(player =>
            <div key={player.id}>{player.name}</div>
          )}
        </div>
      </div>
    )
  }
}

class Results extends Component {
  render() {
    return (
      <div className="Results">
      </div>
    )
  }
}

class Pitch extends Component {
  render() {
    return (
      <div className="Pitch basic"></div>
    )
  }
}

const getPlayersData = (searchValue) => {
  request.open("GET", `${proxy}${urlStart}${searchValue}${urlEnd}`, true)
  request.responseType = "json"
  // Abort previous requests
  request.abort()

  request.addEventListener("readystatechange", e => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        requestResult = request.response
        requestResults = [] // Reset array
        for (let i=0; i<requestResult.items.length; i++) {
          let unique = true
          for (let j=0; j<requestResults.length; j++) {
            // Filter out duplicates and undefined results
            if (
              typeof requestResults[j] !== 'undefined' &&
              (requestResults[j].id == requestResult.items[i].baseId)
            ) {
              unique = false; // is duplicate
            }
          }
          if (unique) {
            requestResults[i] = {
              name: requestResult.items[i].lastName,
              photo: requestResult.items[i].headshotImgUrl,
              flag: requestResult.items[i].nation.imageUrls.small,
              club: requestResult.items[i].club.imageUrls.normal.small,
              id: requestResult.items[i].baseId
            }
            if (requestResult.items[i].commonName.length > 0) {
              requestResults[i].name = requestResult.items[i].commonName
            }
          }
        }
      }
    }
  })

  request.send()
  console.log(requestResults)
  return requestResults
}

export default App
