import {
    Grid,
    Typography,
    TextField,
    FormControl,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
} from "@material-ui/core";
import React, { Component } from "react";
import axios from "../axiosInstance";

class Signup extends Component {
    state = {
        role: "student",
        stream: "",
        degree: "",
        isDialogOpen: false,
        dialogText: "",
    }

    handleChange = (e) => {
        console.log(e);
        e.persist();
        this.setState((prevState, props) => {
            return {
                [e.target.name]: e.target.value,
            };
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            "email": e.target.email.value,
            "password": e.target.password.value,
            "passwordCheck": e.target.passwordCheck.value,
            "Name": e.target.firstName.value,
            
          
        }
        console.log(data);
        axios.post("/auth/signup", data).then(response => {
            if (response.status == 200) {
                console.log("registered successsfully", response.data);
                this.setState({
                    isDialogOpen: true,
                    dialogText: "Registered successfully. You may login now"
                })
            }
            else {
                console.log("error", response.data);
                this.setState({
                    isDialogOpen: true,
                    dialogText: "Some error occured"
                })
            }
        }).catch((error) => {
            console.log(error, error.response);
            this.setState({
                isDialogOpen: true,
                dialogText: "Some error occured"
            })
        });
    }


    render() {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <Grid container direction="column" alignItems="center" justify="center" spacing={1}>
                    <Grid item>
                        <Typography>Create Account</Typography>
                    </Grid>
                    <form onSubmit={this.handleSubmit}>
                        <Grid item>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}><TextField variant="outlined" label="First Name" name="firstName" value={this.state.firstName}></TextField></Grid>
                               
                            </Grid>
                        </Grid>
                        <br />
                        <Grid item xs={12} className="w-100">
                            <TextField fullWidth variant="outlined" type="email" label="Email" name="email"></TextField>
                        </Grid>
                        <br />
                        <Grid item xs={12} className="w-100">
                            <TextField fullWidth variant="outlined" type="password" label="Password" name="password"></TextField>
                        </Grid>
                        <br />
                        <Grid item xs={12} className="w-100">
                            <TextField fullWidth variant="outlined" type="password" label="Re-enter password" name="passwordCheck"></TextField>
                        </Grid>
                        <br />
                        <Grid item>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Role</FormLabel>
                                <RadioGroup aria-label="gender" name="role" value={this.state.role} onChange={this.handleChange}>
                                    <Grid container justify="space-evenly" spacing={3}>
                                        <Grid item xs={12} md={6}><FormControlLabel value="student" control={<Radio />} label="Student" /></Grid>
                                   
                                    </Grid>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <br />
                        {
                            this.state.role === "student" ?
                                <>
                                    <Grid item xs={12} className="w-100">
                                        <TextField fullWidth variant="outlined" type="roll" label="Roll" name="roll"></TextField>
                                    </Grid>
                                    <br />
                                    <Grid item>
                                        <Grid container justify="space-between" spacing={3}>
                                            <Grid item xs={12} md={3} style={{ flexGrow: 2, maxWidth: "100%" }}>
                                                <FormControl variant="outlined" style={{ minWidth: "100%" }}>
                                                    <InputLabel id="degree-label">Degree</InputLabel>
                                                    
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <TextField variant="outlined" label="Year" name="year" value={this.state.year}></TextField>
                                            </Grid>
                        
                                        </Grid>
                                    </Grid>
                                    <br />
                                </>
                                :
                                null
                        }

                        <Grid item xs={12} className="w-100">
                            <Button fullWidth variant="contained" color="primary" type="submit">Create</Button>
                        </Grid>
                    </form>
                </Grid>
                <Dialog open={this.state.isDialogOpen} onClose={() => { this.setState({ isDialogOpen: false }) }}>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.dialogText}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default Signup;