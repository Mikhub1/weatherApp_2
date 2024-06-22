  import "./Form";
  
  /**
   cd4a2b7213d781cb73ed6986ad0316b1
    a1d832c101f04481e98ece5a0a6cb290
  */

function Generate_Url(){
    
    const base_id = "http://api.openweathermap.org/data/2.5/weather?"
    const api_key = "a1d832c101f04481e98ece5a0a6cb290"

    const Complete_Url = base_id + "appid="+api_key+"&q="

    return (Complete_Url)

}

export default Generate_Url


//