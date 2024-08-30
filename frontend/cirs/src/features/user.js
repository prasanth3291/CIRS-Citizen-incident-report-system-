import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// Thunk for resetting the password
export const reset_password = createAsyncThunk(
	'users/reset_password',
	async ({ formData, verified_email }, thunkAPI) => {
		const { otp, password } = formData;
		const body = JSON.stringify({ password, otp, verified_email });

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
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

// Thunk for email verification during password reset
export const forgot_password_email_verification = createAsyncThunk(
	'users/forgot_password',
	async (email, thunkAPI) => {
		try {
			const response = await axios.post('http://localhost:8000/api/forgot_password/', { email }, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});

			const data = await response.data;
			if (response.status === 201) {
				return { email, ...data };
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

// Thunk for registering a user
export const register = createAsyncThunk(
	'users/register',
	async ({ formData }, thunkAPI) => {
		const { first_name, last_name, username, email, password, confirm_password } = formData;
		const body = JSON.stringify({ first_name, last_name, username, email, password, confirm_password });
		console.log(body)

		try {
			const res = await axios.post('http://localhost:8000/api/register/', body, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});

			const data = await res.data;
			if (res.status === 201) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

// Thunk for logging in a user
export const login = createAsyncThunk(
	'users/login',
	async ({ loginData }, thunkAPI) => {
		const { username, password, user_type } = loginData;
		const body = JSON.stringify({ username, password, user_type });

		try {
			const response = await axios.post('http://localhost:8000/api/login/', body, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
			const data = await response.data;
			if (response.status === 200) {
				localStorage.setItem('authTokens', JSON.stringify(data));
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

// Thunk for Google login
export const googleLogin = createAsyncThunk(
	'users/googleLogin',
	async (code, thunkAPI) => {
		try {
			const body = JSON.stringify({ code });
			const response = await axios.post(
				'http://localhost:8000/api/auth/google/',
				body,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const data = await response.data;
			if (data.access) {
			
                localStorage.setItem('authTokens', JSON.stringify(data));
				const decoded = data.user.first_name
				console.log(decoded)
                return data
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

// Thunk for submitting a report
export const report = createAsyncThunk(
	'users/report',
	async ({ formData }, thunkAPI) => {
		try {
			const response = await axios.post('http://localhost:8001/api/report/', formData, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data',
				},
			});

			const data = await response.data;
			if (response.status === 200) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response?.data || err.message);
		}
	}
);

// Thunk for refreshing access tokens
export const refreshAccessToken = createAsyncThunk(
	'users/refreshAccessToken',
	async (_, thunkAPI) => {
		const authTokens = JSON.parse(localStorage.getItem('authTokens'));
		const refresh = authTokens.refresh

		try {
			const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
			const newTokens = response.data;
			newTokens.user = authTokens.user;
			localStorage.setItem('authTokens', JSON.stringify(newTokens));
			return newTokens;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

const storedTokens = localStorage.getItem('authTokens');
let initialUserState;

try {
	const decodedUser = JSON.parse(storedTokens);
	initialUserState = decodedUser
} catch (error) {
	// If decoding fails, assume storedTokens already contain user details
	initialUserState = storedTokens ? JSON.parse(storedTokens) : null;	
}	  


// Initial state for user slice
const initialState = {
	isAuthenticated: false,
	user: initialUserState,
	loading: false,
	registered: false,
	access: null,
	refresh: null,
	email_verified_loading: false,
	email_verified: false,
	error: null,
	register_error:null,
	google_error: null,
	verified_email: null,
	password_reset: false,
	password_reset_error: null,
};


// User slice
const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		resetRegistered: state => {
			state.registered = false;
		},
		logoutUser: state => {
			state.user = null;
			state.isAuthenticated = false;
			state.access = null;
			state.refresh = null;
			localStorage.removeItem('authTokens');
		},
		resetgerror: state => {
			state.google_error = null;
		},
		reset_email: state => {
			state.verified_email = null;
		},
		reset_password_reset: state => {
			state.password_reset = false;
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
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.register_error = action.payload;
				
			})
			.addCase(login.pending, state => {
				state.loading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.access = action.payload.access;
				state.refresh = action.payload.refresh;
				state.user=action.payload.user
				
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(googleLogin.pending, state => {
				state.loading = true;
			})
			.addCase(googleLogin.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.access = action.payload.access;
				state.refresh = action.payload.refresh;
				state.user = action.payload.user; // decoded user data from the action payload
			
				
			})
			.addCase(googleLogin.rejected, (state, action) => {
				state.loading = false;
				state.google_error = action.payload;
			})
			.addCase(forgot_password_email_verification.pending, state => {
				state.email_verified_loading = true;
			})
			.addCase(forgot_password_email_verification.fulfilled, (state, action) => {
				state.email_verified = true;
				state.verified_email = action.payload.email;
			})
			.addCase(forgot_password_email_verification.rejected, (state, action) => {
				state.email_verified_loading = false;
				state.password_reset_error = action.payload;
			})
			.addCase(reset_password.fulfilled, state => {
				state.password_reset = true;
				state.email_verified = false;
				state.password_reset_error = null;
				state.verified_email = null;
			})
			.addCase(reset_password.rejected, (state, action) => {
				state.password_reset_error = action.payload;
			})
			.addCase(refreshAccessToken.fulfilled, (state, action) => {
				state.access = action.payload.access;
				state.refresh = action.payload.refresh;
				state.user=JSON.parse(localStorage.getItem('authTokens'))
			})
			.addCase(refreshAccessToken.rejected, state => {
				state.isAuthenticated = false;
				state.access = null;
				state.refresh = null;
				state.user = null;
			});
	}
});

export const { resetRegistered, logoutUser, resetgerror, reset_email, reset_password_reset } = userSlice.actions;
export default userSlice.reducer;
