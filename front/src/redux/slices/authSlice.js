import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user || null,
  token: token || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const formData = new FormData();
      
      // Common fields
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);
      
      // Role-specific fields
      if (userData.role === 'volunteer') {
        formData.append('firstName', userData.firstName);
        formData.append('lastName', userData.lastName);
        if (userData.phone) formData.append('phone', userData.phone);
        if (userData.bio) formData.append('bio', userData.bio);
        if (userData.wilaya) formData.append('wilaya', userData.wilaya);
        
        // Ensure skills and interests are arrays
        const skills = Array.isArray(userData.skills) ? userData.skills : [];
        const interests = Array.isArray(userData.interests) ? userData.interests : [];
        
        formData.append('skills', JSON.stringify(skills));
        formData.append('interests', JSON.stringify(interests));
        
        console.log('Sending skills:', skills);
        console.log('Sending interests:', interests);
        
        if (userData.profilePhoto instanceof File) {
          formData.append('profilePhoto', userData.profilePhoto);
        }
      } else if (userData.role === 'association') {
        formData.append('associationName', userData.associationName);
        formData.append('phone', userData.phone);
        formData.append('wilaya', userData.wilaya);
        formData.append('address', userData.address);
        formData.append('description', userData.description);
        if (userData.website) formData.append('website', userData.website);
        
        // Use same field name for association logo
        if (userData.logo instanceof File) {
          formData.append('profilePhoto', userData.logo);
        }
      }

      console.log('Sending registration data...');
      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post(`${API_URL}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', response.data.data.token);
      }

      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', response.data.data.token);
      }

      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
