import Spinner from './Spinner'
import Message from './Message'
import CountryItem from './CountryItem'
import styles from './CountryList.module.css'
import { useCities } from '../contexts/CitiesContext'
export default function CityList() {
  const { cities, isLoading } = useCities()
  if (isLoading) return <Spinner />
  if (!cities.length) return <Message message='Add Your First City By Clicking!' />

  const countries = cities.reduce((arr, cur) => {
    if (!arr.map((el) => el.country).includes(cur.country)) {
      return [...arr, { country: cur.country, emoji: cur.emoji }]
    }
    else {
      return arr
    }
  }, [])

  return (
    <ul className={styles.countryList}>
      {countries.map(country => <CountryItem country={country} key={country.id} />)}
    </ul>

  )
}
