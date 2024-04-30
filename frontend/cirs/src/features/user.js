import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const reset_password = createAsyncThunk(
	'users/reset_password',
	async ({ formData,verified_email}, thunkAPI) => { // Wrap parameters into an object
	  const { otp, password } = formData;
	  
	  const body = JSON.stringify({
		password,
		otp,
		verified_email,
	  });
	  console.log(body)
	  try {
		const response = await axios.post('http://localhost:8000/api/reset_password/', body, {
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		  },
		});
		const data = await response.data;
		if (response.status === 200) {
					
		  return data;
		} else {
		  return thunkAPI.rejectWithValue(data);
		}
	  } catch (err) {
		console.log(err.response.data);
		return thunkAPI.rejectWithValue(err.response.data);
	  }
	}
  );
  

export const forgot_password_email_verification = createAsyncThunk(
	'users/forgot_password',
	async(email,thunkAPI)=>{
		
		try{
		const response = await axios.post('http://localhost:8000/api/forgot_password/',{email}, {
			
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},				
		});

		const data = await response.data
		if (response.status === 201) {	
			console.log('fg',data)	
			return {email,...data};
		} else {			
			return thunkAPI.rejectWithValue(data);
		}
	} catch (err) {
		console.log(err.response.data)
		return thunkAPI.rejectWithValue(err.response.data);
	}
}
);


export const register = createAsyncThunk(
	'users/register',
	async ({ formData }, thunkAPI) => {
		const {first_name,last_name,username,email,
		password,confirm_password}=formData
		const body = JSON.stringify({
			first_name,last_name,username,
			email,password,confirm_password			
		});	
		try {
			const res = await axios.post('http://localhost:8000/api/register/',body, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},				
			});		

			const data = await res.data
			if (res.status === 201) {		
				return data;
			} else {
				
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			console.log(err.response.data)
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);
export const login = createAsyncThunk(
'users/login',
async({loginData},thunkAPI)=>{
	const{username,password}=loginData
	const body = JSON.stringify({username,password})
	
	try{
		console.log('called login')
		const response = await axios.post('http://localhost:8000/api/login/',body,{
			method:'POST',
			headers:{
				Accept:'application/json',
				"Content-Type":'application/json'
			}
		})
		const data = await response.data	
		if(response.status == 200){				
			localStorage.setItem('authTokens',JSON.stringify(data))
			return data
		}
		else{
			return thunkAPI.rejectWithValue(data)
		}		
	} catch(err){
		return thunkAPI.rejectWithValue(err.response.data);
	}})
	
	
	export const googleLogin = createAsyncThunk(
		'users/googleLogin',
		async (code, thunkAPI) => {
		  try {
			// console.log('code',JSON.stringify(code))
			const body = JSON.stringify({ code })
			const response = await axios.post(
			  'http://localhost:8000/dj-rest-auth/google/',body,
			  {
				headers: {
				  'Content-Type': 'application/json',
				},
			  }
			);			  
			const data = await response.data;	
			
			if (data.access) {
				localStorage.setItem('authTokens', JSON.stringify(data.user
				  ));

				return data
			} else {
							
			  return thunkAPI.rejectWithValue(data);
			}
		  } catch (err) {
			console.log(err);
			return thunkAPI.rejectWithValue(err.response.data);
		  }
		}
	  );

const storedTokens = localStorage.getItem('authTokens');
let initialUserState;

try {
	const decodedUser = jwtDecode(storedTokens);
	initialUserState = decodedUser
	console.log('1',storedTokens)
	console.log('intry',initialUserState)
} catch (error) {
	// If decoding fails, assume storedTokens already contain user details
	initialUserState = storedTokens ? JSON.parse(storedTokens) : null;
	console.log('2',storedTokens)
	console.log('in err',initialUserState)
	
}	  
	  
const initialState = {
	isAuthenticated: false,
	user: null,
	loading: false,
	registered: false,
	acces:null,
	refresh:null,
	email_verified_loading:false,
	email_verified:false,
	user:initialUserState,
	error:null,
	google_error:null,
	verified_email:null,
	password_reset:false,
	password_reset_error:null,	

};

	
const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		resetRegistered: state => {
			state.registered = false;
		},
		logoutUser: (state) => {
			state.user = null;
		  },
		resetgerror:(state)=>{
			state.google_error=null;
		}, 		
		reset_email:(state)=>{
			state.verified_email=null		
		} ,
		reset_password_reset:(state)=>{
			state.password_reset=false
		}

	},
	extraReducers: builder => {
		builder
			.addCase(register.pending, state => {
				state.loading = true;
				
			})
			.addCase(register.fulfilled, state => {
				state.loading = false;
				state.registered = true;
				
			})
			.addCase(register.rejected, (state,action) => {
				state.loading = false;
				state.error=action.payload
			})
			.addCase(login.pending,state=>{
				state.loading = true;				
			})
			.addCase(login.fulfilled,(state,action)=>{
				state.loading = false
				state.isAuthenticated =true
				state.acces=action.payload.access_token
				state.refresh=action.payload.refresh_token
				state.user=jwtDecode(localStorage.getItem('authTokens'))
			})
			.addCase(login.rejected,(state,action)=>{
				state.loading=false
				state.error=action.payload
			})
		
			.addCase(googleLogin.pending,state=>{
				state.loading = true;				
			})
			.addCase(googleLogin.fulfilled,(state,action)=>{
				state.isAuthenticated=true	
				state.acces=action.payload.access
				state.refresh=action.payload.refresh			
				state.user=JSON.parse(localStorage.getItem('authTokens'))
			})
			.addCase(googleLogin.rejected, (state,action) => {
				state.loading = false;
				state.google_error=action.payload
			})
			.addCase(forgot_password_email_verification.pending,state=>{
				state.email_verified_loading=true
			})
			.addCase(forgot_password_email_verification.fulfilled,(state,action)=>{
				state.email_verified=true
				state.verified_email=action.payload.email
			})
			.addCase(forgot_password_email_verification.rejected,(state,action)=>{
				state.email_verified_loading=false
				state.password_reset_error=action.payload
			})
			.addCase(reset_password.fulfilled,state=>{
				state.password_reset=true
				state.email_verified=false
				state.password_reset_error=null
				state.verified_email=null
			})
			.addCase(reset_password.rejected,(state,action)=>{
				state.password_reset_error=action.payload
			})

	}})
	
export const { resetRegistered,logoutUser,resetgerror,reset_email,reset_password_reset } = userSlice.actions;
export default userSlice.reducer;
