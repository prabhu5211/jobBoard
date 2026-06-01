import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const applyForJob = createAsyncThunk('applications/apply', async ({ jobId, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/applications/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.application;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Application failed');
  }
});

export const fetchMyApplications = createAsyncThunk('applications/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/applications/my-applications');
    return data.applications;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications');
  }
});

export const fetchApplicationsForJob = createAsyncThunk(
  'applications/fetchForJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      return data.applications;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/applications/${id}/status`, { status, note });
      return data.application;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

export const withdrawApplication = createAsyncThunk('applications/withdraw', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/applications/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to withdraw application');
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    myApplications: [],
    jobApplications: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyForJob.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications.unshift(action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchApplicationsForJob.pending, (state) => { state.loading = true; })
      .addCase(fetchApplicationsForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications = action.payload;
      })
      .addCase(fetchApplicationsForJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.jobApplications = state.jobApplications.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })

      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.myApplications = state.myApplications.map((a) =>
          a._id === action.payload ? { ...a, status: 'withdrawn' } : a
        );
      });
  },
});

export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;
