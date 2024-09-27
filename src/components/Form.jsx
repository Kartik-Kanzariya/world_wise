// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";

import ButtonBack from "./ButtonBack";
import { useUrlPositions } from "../hooks/useUrlPositions";
import Message from './Message'
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";


export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'
// const BASE_URL = "https://api-bdc.net/data/reverse-geocode?"
function Form() {

  const [lat , lng] = useUrlPositions()
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji , setEmoji] = useState('')
  const [isLoadingGeoCoding , setIsLoadingGeoCoding] = useState(false)
  const [geocodingError , setGeocodingError] = useState('')

  
  // console.log(lat)
  // const [searchParams] = useSearchParams()
 
  // const lat = searchParams.get('lat')
  
  // const lng= searchParams.get('lng')
   

  useEffect(function(){
    if (!lat && !lng) return ;

    async function fetchCityData(){
      try{
        setIsLoadingGeoCoding(true)
        setGeocodingError('')
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        // const res = await fetch(`${BASE_URL}latitude=${lat}&longitude=${lng}&localityLanguage=en&key=${API_KEY}`)
        const data = await res.json()
        // console.log(data)
        if(!data.countryCode) throw new Error ("that doesn't seem to be a city. click somewhere else" )
        setCityName(data.city || data.locality || '')
        setCountry(data.countryName)
        setEmoji(convertToEmoji(data.countryCode))
      }catch(err){
        setGeocodingError(err.message)
      }
      finally{
        setIsLoadingGeoCoding(true)
      }
    }
    fetchCityData()
  },[lat , lng])


  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    

    await createCity(newCity);
    navigate("/app/cities");
  }

  // if (isLoadingGeoCoding) return <Spinner />;

    if (!lat && !lng) {
    return <Message message="Start by clicking somewhere on the map" />;
    }
  
  if(geocodingError){
   return  <Message message={geocodingError}/>
  }
  

  return (
    <form  className={`${styles.form} ${isLoading ? styles.loading : ""}`}
    onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
       <ButtonBack/>
      </div>
    </form>
  );
}

export default Form;



