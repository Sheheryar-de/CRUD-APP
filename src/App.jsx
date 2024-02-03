import { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  // fetching data from the firestore and
  // set it equal to setData Hook
  const reference = collection(db, "users");
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(reference);
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      // setData(arr);
      setData((prevData) => {
        // Use the previous state to update the state
        // without causing a re-render loop
        if (JSON.stringify(prevData) !== JSON.stringify(arr)) {
          return arr;
        }
        return prevData;
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  // add user in the fireBase and on the screen
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addDoc(reference, {
        name: name,
        email: email,
        city: city,
      });
      setName("");
      setEmail("");
      setCity("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // delete User in the firebase and on screen
  const handleDeleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  // edit user in the firebase and on screen
  const handleEditUser = (id) => {
    const userToEdit = data.find((item) => item.id === id);
    setEditedUser(userToEdit);
    setIsEditing(true);
  };

  const handleUpdateUser = async () => {
    // Update data in Firestore
    const userDoc = doc(db, "users", editedUser.id);
    await updateDoc(userDoc, {
      name: editedUser.name,
      email: editedUser.email,
      city: editedUser.city,
    });

    // Update state
    setData((prevData) =>
      prevData.map((item) => (item.id === editedUser.id ? editedUser : item))
    );

    // Reset state for edit mode
    setEditedUser({});
    setIsEditing(false);
  };

  return (
    <>
      <div className="container">
        <h1>CRUD App using React and Firebase</h1>
        <div>
          {!isEditing && (
            <div>
              <input
                type="text"
                value={name}
                required
                placeholder="Enter Name:"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                type="email"
                value={email}
                required
                placeholder="Enter email:"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="text"
                value={city}
                required
                placeholder="Enter city:"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />
              <button onClick={handleAddUser}>Create User</button>
            </div>
          )}
          {isEditing && (
            <div>
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
              />
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
              />
              <input
                type="text"
                value={editedUser.city}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, city: e.target.value })
                }
              />
              <button onClick={handleUpdateUser}>Update</button>
            </div>
          )}
        </div>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {data.map((item) => (
                <div key={item.id}>
                  <li>
                    Name: {item.name} <br /> Email: {item.email} <br /> City:{" "}
                    {item.city}
                  </li>
                  <button
                    onClick={() => {
                      handleDeleteUser(item.id);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      handleEditUser(item.id);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
