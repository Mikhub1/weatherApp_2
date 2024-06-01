
import "./App.css"
import { useEffect } from 'react';
import Form from "./Form";



function App(){

  useEffect(() => {
    document.title = "Weather App"
})    

  return (
    <div className="layout">
        <div className="sidebar"> 
          <Form ></Form>
      
        </div>
      <h1>Homepage</h1>

</div>

)
}
export default App


