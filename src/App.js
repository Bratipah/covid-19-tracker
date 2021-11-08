import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide"); //default state
  const [countryInfo, setCountryInfo] = useState({}); //Individual country info
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases")
  //STATE used to write a varible in REACT.
  //endpoint for coivd 19 results API.
  //https://disease.sh/v3/covid-19/countries

  //UseEffect is a hookup that runs a piece of code based on a given condition

  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);
  
  useEffect(() => {
    //The code inside will run only once once the comoponents loads.or when counties variable changes.
    //use async that sends a request(fetch) wwhile we do something(then) (await)waiting for it.using an internal function.

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries") //get promise
      .then ((response) => response.json())
      .then ((data) => {
          const countries = data.map((country) => (
            //Map loops an array of data and do the necessary code for the item in the array.it returns an array of the objects or item.
            {
            name: country.country, //United States, United Kingdom
            value: country.countryInfo.iso2, // abreviation;USA,UK,KE
            }
          ));
          
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);

      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' 
    ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      //aLL DATA FROM COUNTRY RESPONSE
      setCountryInfo(data);

      //center on the country info on the map
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);

    })
  };

  console.log("COUNTRY INFO >>>>", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined" onChange={onCountryChange}
              value={country}>

              {  /*Loop through all the countries and show a drop down list of all options*/}
              <MenuItem value="worldwide">Worlwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          </div>
          
          {/* {Header} */}
          {/* {Title+ select input dropdown field} */}
          
          <div className= "app__stats">
            {/* New components for each infoBox */}
            
            {/* {Infoboxs title="Coronavirus cases"} */}
            <InfoBox
            isRed 
            active={caseType === "cases"}
            onClick = {e => setCasesType('cases')}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}/>

            {/* {Infoboxs title="Coronavirus recoveries} */}
            <InfoBox 
            active={caseType === "recovered"}
            onClick = {e => setCasesType('recovered')}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}/>

            {/* {Infoboxs title="Coronavirus deaths} */}
            <InfoBox 
            isRed
            active={caseType === "deaths"}
            onClick = {e => setCasesType('deaths')}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}/>
          </div>

          {/* {Map} */}
          <Map casesType ={casesType} countries ={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* {Table} */}
          <Table countries={tableData}/>
          <h3>Worldwide New {casesType}</h3>
          <LineGraph casesType={casesType}/>
          {/* {Graphs} */}

        </CardContent>
      </Card>       
    </div>
  );
}

export default App;
