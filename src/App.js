import { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

function App() {
  const [users, setUsers] = useState([]);
  const [name,setName] = useState("");
  const [age, setAge] = useState(0);
  const userCollectionRef  = collection(db,"users")

  useEffect(()=>{
    const getUsers = async ()=>{
       const data = await getDocs(userCollectionRef);
       setUsers(
         data.docs.map((doc)=>{
           return {...doc.data(), id: doc.id}
         })
       )
    }
    getUsers()
  }, [])

  async function addUser () {
    await addDoc(userCollectionRef, 
        {
          name: name,
          age: Number(age)
        }
      )
  }

  async function updateUser (id, age, isIncrease){
    // specify the updated user db, collection, id 
    const userDoc = doc(db, "users", id)
    let newUser = {};
    if(isIncrease){
       newUser = {age: age+1}
    }else{
       newUser = {age: age-1}
    }
    console.log(newUser)
    await updateDoc(userDoc ,newUser)
  }

  async function deleteUser (id){
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    console.log("deleted");
  }

  return (
    <div className="App">
      <input 
        type="text" 
        placeholder='Name' 
        onChange={(event)=>{setName(event.target.value)}}>
      </input>
      <input 
        type="number" 
        placeholder='Age' 
        onChange={(event)=>{setAge(event.target.value)}}>
      </input>

      <button onClick={addUser}> Add User</button>

      {users.map((user)=>{
        return (
          <div>
            <h2>Name: {user.name}</h2>
            <h2>Age: {user.age}</h2>
            <button onClick=
              {
                ()=>{updateUser(user.id, user.age, false)}
              }>
              - Age
            </button>
            <button onClick=
              {
                ()=>{updateUser(user.id, user.age, true)}
              }>
              + Age
            </button>
            <button onClick={()=>{deleteUser(user.id)}}>
              Delete User
            </button>
          </div>
        )
      })}
    </div>
  );
}

export default App;
