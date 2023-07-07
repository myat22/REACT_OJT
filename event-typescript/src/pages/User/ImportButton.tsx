import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Button from '@mui/material/Button';

interface CSVRow {
  [key: string]: string;
}

const ImportButton: React.FC = () => {
  const [file, setFile] = useState<File | undefined>();

  const fileReader = new FileReader();

  /**
   * file is selected change the file name and import file
   * @param e 
   */
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      fileReader.onload = function (event) {
        if (event.target && event.target.result) {
          const text = event.target.result.toString();
          csvFileToArray(text);
        }
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };

  /**
   * to upload csv file to the server
   * @param string 
   */
  const csvFileToArray = (string: string): void => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const rows: CSVRow[] = csvRows.map((row) => {
      const  values= row.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {} as CSVRow);
      return obj;
    });
    rows.map((row) => {
        const apiFormData = new FormData();
        apiFormData.append("name", row?.name);
        apiFormData.append("email", row?.email);
        apiFormData.append("password", row?.password);
        apiFormData.append("role", row?.role);
        apiFormData.append("dob", row?.dob);
        apiFormData.append("phone", row?.phone);
        apiFormData.append("address", row?.address);
        apiFormData.append("profile", row?.fileName);

        axios.post('http://localhost:8000/api/user/create', apiFormData).then((response) => {
        if (response.status === 200) {
          window.location.href = '/admin/users';
        }
      }).catch(error => {
        console.log(error);
      });
    })
  };

  const styles = {
    inputField: {
      cursor: 'pointer',
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      
      <Button sx={{color: 'white', border: '2px solid #d9d95e', background: '#b1b1228a'}}>
        <input
          type="file"
          id="csvFileInput"
          accept=".csv"
          style={styles.inputField}
          onChange={handleOnChange}
        />
        IMPORT CSV</Button>
      <br />
    </div>
  );
}

export default ImportButton;
