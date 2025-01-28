import React, { useEffect, useState } from 'react'
import{Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,Paper} from '@mui/material'
import axios from 'axios'
import { blue, grey, pink, red } from '@mui/material/colors'

const apiUrl='https://jsonplaceholder.typicode.com/users'; //JSONAPI


// Components
const ListUsers = () => {
  const[users,setUsers]=useState([]);
  const [currentPage,setCurrentPage]=useState(1);
  const[openDialog,setOpenDialog]=useState(false);
  const[dialogMode,setDialogMode]=useState("add");
  const [selectedUser,setSelectedUser]=useState(null);
  const[errorMessage,setErrorMessage]=useState('');
  

  const rowsPerPage=5;

  useEffect(()=>{
    fetchUsers();
  },[]);


                                           // GET Request for list of users
  const fetchUsers=async()=>{
    try {
      const responseUsers=await axios.get(apiUrl);
      const changeFormate=responseUsers.data.map((user)=>{
        const[firstName,...lastNamep]=user.name.split(' ')
        return{
          ...user,firstName,lastName:lastNamep.join(" "),
        };
      });
      setUsers(changeFormate)
    } catch (error) {
      setErrorMessage('Something wrong, please try again!!')
    }
     
    };


                     // POST Request for send new user
  const addUser=async (user)=>{
    try {
      const response=await axios.post(apiUrl,user);
      const[firstName,...lastNamep]=response.data.name.split(' ')
      setUsers([{...response.data,firstName,lastName:lastNamep.join(' ')}, ...users])
    } catch (error) {
      setErrorMessage('Failed to add user..')
    };
  }
                            //PUT Request for update the selected user
  const handleEditUser= async (user)=>{
    try {
      await axios.put(`${apiUrl}/${user.id}`,user);
      setUsers(users.map((u)=>(u.id===user.id ? user:u)));
    } catch (error) {
      setErrorMessage('Failed to upadate user.');
    }
  }
                             // DELETE Request for delete user
  const handleDeleteUser=async(id)=>{
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setUsers(users.filter((user)=>user.id !==id));
    } catch (error) {
      setErrorMessage('failed to delete user..')
    }
  };

  const handleDialogOpen=(mode, user=null)=>{
      setDialogMode(mode);
      setSelectedUser(user);
      setOpenDialog(true);
  };

  const handleDialogClose=()=>{
    setOpenDialog(false);
    setSelectedUser(null);

  }
                    //submit the form
  const handleFormSubmit=(e)=>{
    e.preventDefault();
    const{id,firstName,lastName,email, department}=selectedUser;

    if(!firstName.trim() || !lastName.trim() || !email.trim() || !department.trim()){
      alert("All fields are required")
      return false;
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!pattern.test(email)){
      alert("Please enter a valid email address!");
      return false;
    }
    

    
    const fullname=`${firstName} ${lastName}`;
    if(dialogMode==='add'){
      addUser({name:fullname,email, department});
    }
    else{
      handleEditUser({id,name:fullname,email, department})
    }
    handleDialogClose();
  }



  const handleInputChange=(e)=>{
    const{name,value}=e.target
    setSelectedUser({...selectedUser,[name]:value});


   
  };



 



  const handlePreviousPage=()=>{
    if(currentPage>1){
      setCurrentPage((prev)=>prev-1);
    }
  };

  const handleNextPage=()=>{
    if(currentPage<(Math.ceil(users.length/rowsPerPage))){
      setCurrentPage((prev)=>prev+1);
    }
  };

//Pagination
  const paginatedUsers=users.slice((currentPage -1)*rowsPerPage,currentPage*rowsPerPage);

  return (
   
    <Box p={2}>
      <Box display='flex' justifyContent='space-between' alignItems='center' component={Paper}  sx={{
        backgroundColor:blue[500],
        height:'80px'

      }}>
      <Typography variant='h4' sx={{color:'white'}}>User Management Dashboard</Typography>
      <Button variant='contained'  sx={{backgroundColor:'white',color:grey[900],marginRight:'20px'}} onClick={()=>handleDialogOpen('add')}>+Add User</Button>
      </Box>
      
      {errorMessage && (<Typography color='error'>
           {errorMessage}
      </Typography>)}

      <Typography variant='h4'  sx={{color:blue[900],marginTop:4}}>List of users</Typography>
      <TableContainer component={Paper}  >
        <Table >
          <TableHead sx={{fontWeight:300}}>
            <TableRow >
              <TableCell>Id</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user)=>(
              <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.department===undefined?"No such column":null}</TableCell>
              <TableCell>
                <Button color='primary' onClick={()=>handleDialogOpen('edit',user)}>Edit</Button>
                <Button color='secondary' onClick={()=>handleDeleteUser(user.id)}>Delete</Button>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display='flex' justifyContent='end' alignItems='center' mt={2} pr={4}>
     <Button variant='contained' disabled={currentPage===1}  onClick={handlePreviousPage}>Previous</Button>
     <Typography ml={1} mr={1} sx={{color:'darkblue',fontSize:'19px',fontWeight:'300'}}>{currentPage}</Typography>
     <Button variant='contained'  disabled={currentPage=== Math.ceil(users.length/rowsPerPage)}  onClick={handleNextPage}>Next</Button>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth component='form' onSubmit={handleFormSubmit}>
        <DialogTitle>{dialogMode==='add' ? 'Add user':'Edit User'}</DialogTitle>
        <DialogContent>
          <TextField margin='dense' label='First name' name='firstName'
          value={selectedUser?.firstName || ''}
          onChange={handleInputChange}
          
          required
          fullWidth

          />
          <TextField margin='dense' label='Last name' name='lastName'
          value={selectedUser?.lastName || ''}
          onChange={handleInputChange}
          
          fullWidth
          required
          />
          <TextField margin='dense' label='Email' name='email'
          value={selectedUser?.email || ''}
          onChange={handleInputChange}
          
          fullWidth
          required
          />
          <TextField margin='dense' label='Department' name='department'
          value={selectedUser?.department|| ''}
          onChange={handleInputChange}
          fullWidth
          required
          />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' type='submit' >{dialogMode==='add'? 'Add':'Save'}</Button>
          <Button sx={{backgroundColor:red[900],color:'white'}} onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </Box>
   
  )
}

export default ListUsers