// import { createContext , useState , useEffect, useContext } from "react";

// const BASE_URL = 'http://localhost:9000'
// const CitiesContext = createContext()

// function CitiesProvider({children}){

//     const [cities, setCities] = useState([])
//     const [isLoading, setIsLoading] = useState(false)
//     const [currentCity , setCurrentCity]= useState({})
  
//     useEffect(function () {
//       async function fetchCities() {
//         try {
//           setIsLoading(true)
//           const res = await fetch(`${BASE_URL}/cities`)
//           const data = await res.json()
//           setCities(data)
//         }
//         catch {
//           alert('there was an error loading data')
//         }
//         finally {
//           setIsLoading(false)
//         }
//       }
//       fetchCities()
//     }, [])


//     async function getCities(id){
//       try {
//         setIsLoading(true)
//         const res = await fetch(`${BASE_URL}/cities/${id}`)
//         const data = await res.json()
//         setCurrentCity(data)
//       }
//       catch {
//         alert('there was an error loading data')
//       }
//       finally {
//         setIsLoading(false)
//       }
//     }

//     async function createCity(newCity){
//       try{
//         setIsLoading(true)
//         const res = await fetch(`${BASE_URL}/cities` , {
//           method:"POST",
//           body : JSON.stringify(newCity),
//           headers:{
//             "Content-Type": "application/json",
//           },
//         })
//         const data = await res.json()
//         setCities(cities=>[...cities , data])
//       }
//       catch {
//         alert('there was an error create city')
//       }
//       finally {
//         setIsLoading(false)
//       }
      
//     }


//     async function deleteCity(id){
//       try{
//         setIsLoading(true)
//          await fetch(`${BASE_URL}/cities/${id}` , {
//           method:"DELETE",
       
//         })
       
//         setCities((cities)=>cities.filter((city)=>city.id!==id))
//       }
//       catch {
//         alert('there was an error deleting city')
//       }
//       finally {
//         setIsLoading(false)
//       }
      
//     }
    

//     return(
//         <CitiesContext.Provider value={{
//             cities,
//             isLoading,
//             currentCity,
//             getCities,
//             createCity,
//             deleteCity
//         }}>
//             {children}
//         </CitiesContext.Provider>
//     )
// }

// function useCities(){
//   const context = useContext(CitiesContext)
//   return(
//     context
//   )
// }

// export {CitiesProvider , useCities}






// CONTEXT WITH USE REDUCER

import { createContext , useEffect, useContext, useReducer } from "react";

const BASE_URL = 'http://localhost:9000'
const CitiesContext = createContext()


const intialstate ={
  cities:[],
  isLoading:"false",
  currentCity:{},
  error:''
}

function reducer(state , action){
  switch (action.type){
    case 'loading':
      return{
        ...state , isLoading:true
      };

    case 'cities/loaded':
      return{
        ...state , isLoading:false ,
        cities:action.payload
      };

      case 'city/loaded':
        return{
          ...state , currentCity:action.payload , isLoading:false
        }

      case 'city/created' :
        return{
          ...state , isLoading:false ,
          cities : [...state.cities , action.payload],
          currentCity:action.payload
        }

        case 'city/deleted':
          return{
            ...state , isLoading:false ,
            cities: state.cities.filter((city)=>city.id!==action.payload),
            currentCity:{}
          }

      case 'rejected':
        return{
          ...state , 
          isLoading:false,
          error:action.payload
        }

      default:
        throw new Error("Unknown action type");

  }
}
function CitiesProvider({children}){

  const [{cities , isLoading , currentCity , error} , dispatch]=useReducer(reducer , intialstate)


  
    useEffect(function () {
      async function fetchCities() {
      dispatch({type:'loading'})
        try {
          
          const res = await fetch(`${BASE_URL}/cities`)
          const data = await res.json()
          dispatch({type:'cities/loaded' , payload: data})
        }
        catch {
          dispatch({
            type:'rejected' , payload : "There was an error loading cities.."
          })
        }
    
      }
      fetchCities()
    }, [])


    async function getCities(id){
      if (Number(id) === currentCity.id) return;
      dispatch({type:'loading'})
      try {
       
        
        const res = await fetch(`${BASE_URL}/cities/${id}`)
        const data = await res.json()
        dispatch({
          type:'city/loaded' , payload: data
        })
      }
      catch {
        dispatch({
          type:'rejected' , payload : "There was an error loading cities.."
        })
      }
     
    }

    async function createCity(newCity){
      dispatch({type:'loading'})
      try{
      
        const res = await fetch(`${BASE_URL}/cities` , {
          method:"POST",
          body : JSON.stringify(newCity),
          headers:{
            "Content-Type": "application/json",
          },
        })
        const data = await res.json()
        dispatch({
          type:'city/created' , payload:data
        })
      }
      catch {
        dispatch({
          type:'rejected' , payload : "There was an error loading cities.."
        })
      }
     
      
    }


    async function deleteCity(id){
      dispatch({type:'loading'})
      try{
       
         await fetch(`${BASE_URL}/cities/${id}` , {
          method:"DELETE",
       
        })
       
        dispatch({
          type:"city/deleted" , payload: id
        })
      }
      catch {
        dispatch({
          type:'rejected' , payload : "There was an error loading cities.."
        })
      }
     
      
    }
    

    return(
        <CitiesContext.Provider value={{
            cities,
            isLoading,
            currentCity,
            getCities,
            createCity,
            deleteCity,
            error
        }}>
            {children}
        </CitiesContext.Provider>
    )
}

function useCities(){
  const context = useContext(CitiesContext)
  return(
    context
  )
}

export {CitiesProvider , useCities}