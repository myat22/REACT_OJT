
import axios from "axios";
import React, { useState } from "react";
import HeaderPage from '../../components/Header/HeaderPage';
import FileUploadForm from './FileUploadForm';

let RichMenu: React.FC = () => {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPerviewImage] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
    image: '',
    default_menu: '0',
  });

  const isButtonEnabled = Object.values(inputValues).every((value) => value.length > 0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((preValues) => ({ ...preValues, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((preValues) => ({...preValues, [name]: value }));
    const file = event.target.files?.[0];
    if(file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPerviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPerviewImage(null);
    }
  }

  // when create button clicked
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>)  => {
    event.preventDefault();
    console.log(inputValues);
    const apiFormData = new FormData();
    apiFormData.append("title", inputValues.title);
    apiFormData.append("description", inputValues.description);
    if (selectedFile) {
      apiFormData.append("image", selectedFile);
    }
    apiFormData.append("default_menu", inputValues.default_menu);

    console.log(apiFormData);
    axios.post('http://localhost:8000/api/richmenu/create', apiFormData).then((response) => {
      if (response.status === 200) {
        console.log(response);
        // window.location.href = '/admin/users';
      }
    }).catch(error => {
      console.log(error);
    });
  }

  const styles = {
    create: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: '34px',
      backgroundColor: '#4e7294',
    },
    createBox: {
        marginTop: '1rem',
        width: '88rem',
        background: '#e0eaff',
        color: '#cce6ff',
        borderRadius: '8px',
    },
    createHeader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize:' xx-large',
      fontWeight: 'bolder',
      marginTop: '30px',
      marginButton: '40px',
      color: '#000'
    },
    input: {
        width: "50%",
    }, 
    radioImageStyle: {
      display: "flex",
      marginBottom: "5px",
      marginTop: "25px",
      width: "100%",
    }, 
    submitButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      fontSize: "14px",
      background: '#32dc32b0',
      color: '#fff',
      cursor: 'pointer',
    },
    disableButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      fontSize: "14px",
      background: '#acd8acc4',
      color: '#fff',
      cursor: 'no-drop',
    },
    errorMessage: {
      display: "block",
      fontSize: "14px",
      color: "#b41616",
    }
  }

  return (
    <div>
    <HeaderPage />
    <form style={styles.create} onSubmit={handleFormSubmit}> 
      <div style={styles.createBox}>
        <div style={styles.createHeader}>Rich Menu</div>
          <FileUploadForm
            inputValues={inputValues}
            handleFormSubmit={handleFormSubmit}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            previewImage={previewImage}
          />
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "20px" }}>
            <button 
              style={isButtonEnabled? styles.submitButton : styles.disableButton} 
              type="submit" 
              disabled={!isButtonEnabled}>
                Create
            </button>
          </div>
      </div>
    </form>
  </div>
  )
}  

export default RichMenu;